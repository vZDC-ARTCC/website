'use server';


import {VATUSA_API, VATUSA_API_KEY, VATUSA_FACILITY} from "@/actions/vatusa/config";

export const removeVatusaController = async (cid: string, visitor?: boolean) => {

    const res = await fetch(`${VATUSA_API}/facility/${VATUSA_FACILITY}/roster/${visitor ? 'manageVisitor/' : ''}${cid}?apiKey=${VATUSA_API_KEY}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    return res.ok;
}

export const addVatusaVisitor = async (cid: string) => {
    const res = await fetch(`${VATUSA_API}/facility/${VATUSA_FACILITY}/roster/manageVisitor/${cid}?apiKey=${VATUSA_API_KEY}`, {
        method: 'POST',
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    return res.ok;
}