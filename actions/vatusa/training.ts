'use server';

import {VATUSA_API, VATUSA_API_KEY} from "@/actions/vatusa/config";

export const createVatusaTrainingSession = async (studentCid: string, instructorCid: string, sessionDate: Date, position: string, duration: string, notes: string) => {
    const res = await fetch(`${VATUSA_API}/user/${studentCid}/training/record?apiKey=${VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${VATUSA_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instructorCid,
            sessionDate,
            position,
            duration,
            notes,
        }),
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    const data = await res.json();

    return data.id;
}

export const editVatusaTrainingSession = async (studentCid: string, instructorCid: string, sessionDate: Date, position: string, duration: string, notes: string, id: string) => {
    const res = await fetch(`${VATUSA_API}/training/record/${id}?apiKey=${VATUSA_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instructorCid,
            sessionDate,
            position,
            duration,
            notes,
        })
    });

    if (!res.ok) {
        console.log(await res.json());
    }

    const data = await res.json();

    return data.id;
}

export const deleteVatusaTrainingSession = async (id: string) => {
    const res = await fetch(`${VATUSA_API}/training/record/${id}?apiKey=${VATUSA_API_KEY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.log(res.statusText);
    }

    return res.ok;
}