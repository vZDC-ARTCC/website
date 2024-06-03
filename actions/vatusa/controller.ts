'use server';

import {VATUSA_API, VATUSA_API_KEY} from "@/actions/vatusa/config";

export const addVatusaSolo = async (cid: string, position: string, expires: Date) => {
    const res = await fetch(`${VATUSA_API}/solo?apiKey=${VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid,
            position,
            expires,
        }),
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    const data = await res.json();
    return data.cid;
}

export const deleteVatusaSolo = async (cid: string, position: string) => {
    const res = await fetch(`${VATUSA_API}/solo?apiKey=${VATUSA_API_KEY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid,
            position,
        }),
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    const data = await res.json();
    return data.cid;
}