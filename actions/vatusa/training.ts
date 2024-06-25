'use server';

import {VATUSA_API, VATUSA_API_KEY, VATUSA_FACILITY} from "@/actions/vatusa/config";

export const createVatusaTrainingSession = async (location: number, studentCid: string, instructor_id: number,
                                                  session_date: Date, position: string, duration: string, notes: string) => {

    const timeSplit = session_date.toISOString().split("T");

    const sessionDate = timeSplit[0]+" "+timeSplit[1].split(":")[0]+":"+timeSplit[1].split(":")[1]

    var ticketObj = {
        'instructor_id': instructor_id,
        'session_date': sessionDate,
        'position': position,
        'duration': duration,
        'notes': notes?notes:"No Notes",
        'location': location,
    }

    var ticketForm = []
    for (var property in ticketObj) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(ticketObj[property]);
        ticketForm.push(encodedKey + "=" + encodedValue);
    }
    
    const res = await fetch(`${VATUSA_API}/user/1775879/training/record?apikey=${VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: ticketForm.join("&"),
    })


    const data = await res.json();

    return data.id;
}

export const editVatusaTrainingSession = async (instructor_id: string, session_date: Date, position: string, duration: string, notes: string, id: string) => {
    const res = await fetch(`${VATUSA_API}/training/record/${id}?apikey=${VATUSA_API_KEY}`, {
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
    const res = await fetch(`${VATUSA_API}/training/record/${id}?apikey=${VATUSA_API_KEY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });


    return res.ok;
}