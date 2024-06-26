'use server';

import {VATUSA_API, VATUSA_API_KEY} from "@/actions/vatusa/config";

export const addVatusaSolo = async (cid: string, position: string, expires: Date) => {
    const res = await fetch(`${VATUSA_API}/solo?apikey=${VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid,
            position,
            expires: expires.toUTCString(),
        }),
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    const data = await res.json();
    return data.cid;
}

export const deleteVatusaSolo = async (cid: string, position: string) => {
    const res = await fetch(`${VATUSA_API}/solo?apikey=${VATUSA_API_KEY}`, {
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

export const getController = async (cid: string): Promise<{
    fname: string,
    lname: string,
    email: string,
    rating: number,
} | undefined> => {
    const res = await fetch(`${VATUSA_API}/user/${cid}?apikey=${VATUSA_API_KEY}`);
    const data = await res.json();
    if (data.data.status === 'error') {
        return undefined;
    }

    return data.data;
}