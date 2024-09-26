'use server';


import {VATUSA_API, VATUSA_API_KEY, VATUSA_FACILITY} from "@/actions/vatusa/config";
import {User} from "next-auth";

export const removeVatusaController = async (staffUser: User, cid: string, visitor?: boolean) => {

    const res = await fetch(`${VATUSA_API}/facility/${VATUSA_FACILITY}/roster/${visitor ? 'manageVisitor/' : ''}${cid}?apikey=${VATUSA_API_KEY}`, {
        method: 'DELETE',
        body: JSON.stringify({
            reason: `Removed by ${staffUser.fullName} via ZDC Dashboard Roster Purge on ${new Date().toISOString()}`,
            by: staffUser.cid,
        })
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    return res.ok;
}

export const addVatusaVisitor = async (cid: string) => {
    const res = await fetch(`${VATUSA_API}/facility/${VATUSA_FACILITY}/roster/manageVisitor/${cid}?apikey=${VATUSA_API_KEY}`, {
        method: 'POST',
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    return res.ok;
}