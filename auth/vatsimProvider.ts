import {OAuthConfig} from "@auth/core/providers";
import {Profile, User} from "next-auth";
import {ControllerStatus, Role, StaffPosition} from "@prisma/client";
import prisma from "@/lib/db";

// vatusa facility id from environment variables
const VATUSA_FACILITY = process.env['VATUSA_FACILITY'];
// detect if the app is in development mode
const DEV_MODE = process.env.NODE_ENV === "development";
// vatsim oauth endpoint base url from environment variables
const VATSIM_URL = process.env.DEV_MODE === "true" ? 'https://auth-dev.vatsim.net' : 'https://auth.vatsim.net';

// enables authentication with vatsim
// needs a client and secret key to work correctly
// https://www.vatsim.dev
export default function VatsimProvider(clientId?: string, clientSecret?: string) {
    return {
        id: 'vatsim',
        name: 'VATSIM',
        type: 'oauth',
        // when a user attempts to sign in, a link is generated with the following scopes.
        // the url property is just the base url for all the other parameters to attach to
        authorization: {
            url: `${VATSIM_URL}/oauth/authorize`,
            params: {scope: "email vatsim_details full_name"},
        },
        // after a user has logged in, a code is passed back to this app from VATSIM.
        // using this code, an access token is fetched using the following url
        // again, parameters are automatically added thanks to next-auth
        token: {
            url: `${VATSIM_URL}/oauth/token`,
        },
        // once the access token is obtained, it is used to fetched data about the user, such as cid, rating, name, etc..
        userinfo: {
            url: `${VATSIM_URL}/api/user`,
        },

        // user is transformed into a different format than what VATSIM provides before being saved in the database and logged in
        profile: async ({data}: { data: Profile }) => {
            return {
                id: data.cid,
                cid: data.cid,
                firstName: data.personal.name_first,
                lastName: data.personal.name_last,
                fullName: data.personal.name_full,
                email: data.personal.email,
                artcc: data.vatsim.subdivision.id || '',
                division: data.vatsim.division.id || '',
                rating: data.vatsim.rating.id,
                updatedAt: new Date(),
                ...await getVatusaData(data),
            } as User;
        },
        clientId,
        clientSecret,
    } satisfies OAuthConfig<any>;
}

export const getVatusaData = async (data: Profile | User): Promise<{
    controllerStatus: ControllerStatus,
    roles: Role[],
    staffPositions: StaffPosition[],
    operatingInitials?: string,
}> => {

    let operatingInitials;
    if ('personal' in data && 'name_first' in data.personal && 'name_last' in data.personal) {
        const users = await prisma.user.findMany();
        const otherInitials = users.map(user => user.operatingInitials).filter(initial => initial !== null) as string[];
        operatingInitials = getOperatingInitials(data.personal.name_first, data.personal.name_last, otherInitials);
    }

    if (DEV_MODE) {
        return {
            controllerStatus: "HOME",
            roles: [
                "CONTROLLER", "MENTOR", "INSTRUCTOR", "STAFF"
            ],
            staffPositions: [
                "ATM"
            ],
            operatingInitials,
        };
    }
    const res = await fetch(`https://api.vatusa.net/v2/user/${data.cid}`, {
        next: {
            revalidate: 900,
        }
    });
    const userData = await res.json();
    const controller = userData.data as {
        cid: number,
        facility: string,
        roles: {
            facility: string,
            role: string,
        }[],
        visiting_facilities: {
            facility: string,
        }[],
    };

    if (!controller) return {controllerStatus: "NONE", roles: [], staffPositions: [],};
    const controllerRoles = controller.roles.filter(r => r.facility === VATUSA_FACILITY).map(r => r.role);
    const controllerStatus: ControllerStatus = controller.facility === VATUSA_FACILITY ? "HOME" : controller.visiting_facilities.map((vf) => vf.facility).includes(VATUSA_FACILITY || '') ? "VISITOR" : "NONE";
    return {controllerStatus, operatingInitials, ...getRolesAndStaffPositions(controllerRoles)};
}

export const getOperatingInitials = (firstName: string, lastName: string, otherInitials: string[]): string => {
    let initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    while (otherInitials.includes(initials)) {
        initials = generateRandomInitials();
    }

    return initials;
}

const generateRandomInitials = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 2; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const getRolesAndStaffPositions = (controllerRoles: string[]) => {
    const roles: Role[] = [];
    const staffPositions: StaffPosition[] = [];
    roles.push("CONTROLLER");
    if (controllerRoles.includes("MTR")) {
        staffPositions.push("MTR");
        roles.push("MENTOR");
    }
    if (controllerRoles.includes("INS")) {
        staffPositions.push("INS");
        roles.push("INSTRUCTOR");
    }
    if (controllerRoles.includes("ATM")) {
        staffPositions.push("ATM");
        roles.push("STAFF");
    }
    if (controllerRoles.includes("DATM")) {
        staffPositions.push("DATM");
        roles.push("STAFF");
    }
    if (controllerRoles.includes("TA")) {
        staffPositions.push("TA");
        roles.push("STAFF");
    }
    if (controllerRoles.includes("EC")) {
        staffPositions.push("EC");
        roles.push("STAFF");
    }
    if (controllerRoles.includes("FE")) {
        staffPositions.push("FE");
        roles.push("STAFF");
    }
    if (controllerRoles.includes("WM")) {
        staffPositions.push("WM");
        roles.push("STAFF");
    }
    return {roles, staffPositions};
}