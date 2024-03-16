import {OAuthConfig} from "@auth/core/providers";
import {Profile, User} from "next-auth";
import {Role, StaffPosition} from "@prisma/client";

// vatusa facility id from environment variables
const VATUSA_FACILITY = process.env['VATUSA_FACILITY'];
// detect if the app is in development mode
const DEV_MODE = process.env['DEV_MODE'] === 'true';
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
                division: data.vatsim.division.id,
                rating: data.vatsim.rating.id,
                ...await getRolesAndStaffPosition(data),
            } as User;
        },
        clientId,
        clientSecret,
    } satisfies OAuthConfig<any>;
}

const getRolesAndStaffPosition = async (data: Profile): Promise<{
    roles: Role[],
    staffPositions: StaffPosition[],
}> => {
    if (DEV_MODE) {
        return {roles: ["CONTROLLER", "MENTOR", "INSTRUCTOR", "STAFF"], staffPositions: ["ATM"],};
    }
    const res = await fetch(`https://api.vatusa.net/v2/facility/${VATUSA_FACILITY}/roster/both`);
    const rosterData = await res.json();
    const controllers = rosterData.data as {
        cid: string,
        roles: {
            facility: string,
            role: string,
        }[],
    }[];

    const controller = controllers.filter(c => c.cid === data.cid)[0];
    if (!controller) return {roles: [], staffPositions: [],};
    const roles: Role[] = [];
    const controllerRoles = controller.roles.filter(r => r.facility === VATUSA_FACILITY).map(r => r.role);
    let staffPositions: StaffPosition[] = [];
    if (controller) {
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
    }
    return {roles, staffPositions,};
}