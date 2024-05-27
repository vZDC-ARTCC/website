'use server';

import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {getRolesAndStaffPositions} from "@/auth/vatsimProvider";
import {revalidatePath} from "next/cache";

const DEV_MODE = process.env.NODE_ENV === "development";
export const refreshData = async () => {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    const now = new Date();
    if (!DEV_MODE && now.getTime() - session.user.updatedAt.getTime() < 1000 * 60 * 5) {
        throw new Error("You can only refresh your data every 5 minutes.");
    }

    const {user} = session;

    const res = await fetch(`https://api.vatusa.net/v2/user/${user.cid}`);
    const {data}: {
        data: {
            status?: string,
            cid: string,
            fname: string,
            lname: string,
            email: string,
            facility: string,
            rating: number,
            roles: {
                facility: string,
                role: string,
            }[],
        },
    } = await res.json();


    if (data.status === "error") {
        await prisma.user.update({
            data: {
                controllerStatus: "NONE",
                staffPositions: {
                    set: [],
                },
                roles: {
                    set: [],
                },
                updatedAt: new Date(),
            },
            where: {
                cid: user.cid,
            }
        });
        return;
    }


    const {
        staffPositions,
        roles
    } = getRolesAndStaffPositions(data.roles.filter(r => r.facility === process.env.VATUSA_FACILITY).map(r => r.role));
    await prisma.user.update({
        data: {
            firstName: data.fname,
            lastName: data.lname,
            email: data.email,
            rating: data.rating,
            controllerStatus: data.facility === process.env.VATUSA_FACILITY ? "HOME" : "VISITOR",
            artcc: data.facility,
            roles: {
                set: roles,
            },
            staffPositions: {
                set: staffPositions,
            },
            updatedAt: new Date(),
        },
        where: {
            cid: user.cid,
        }
    });

    revalidatePath('/', "layout");

}