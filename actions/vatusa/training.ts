'use server';

import {VATUSA_API, VATUSA_API_KEY} from "@/actions/vatusa/config";

export const createVatusaTrainingSession = async (location:number = 2 ,facility_id: string = 'ZDC', studentCid: string, instructor_id: string,
                                                  session_date: Date, position: string, duration: string, notes: string) => {
    const res = await fetch(`${VATUSA_API}/user/${studentCid}/training/record?apiKey=${VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            facility_id,
            instructor_id,
            session_date,
            position,
            duration,
            notes,
            location,
        }),
    });


    const data = await res.json();

        return data.id;
    }

export const editVatusaTrainingSession = async (studentCid: string, instructor_id: string, session_date: Date, position: string, duration: string, notes: string, id: string) => {
    const res = await fetch(`${VATUSA_API}/training/record/${id}?apiKey=${VATUSA_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instructor_id,
            session_date,
            position,
            duration,
            notes,
        })
    });

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


    return res.ok;
}