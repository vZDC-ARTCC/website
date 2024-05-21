'use client';
import React from 'react';
import {Airport} from "@prisma/client";
import {Button, Grid, TextField,} from "@mui/material";
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {upsertAirport} from "@/actions/airports";
import {useRouter} from "next/navigation";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function AirportForm({airport, traconGroupId}: { airport?: Airport, traconGroupId: string, }) {

    const router = useRouter();
    const handleSubmit = async (formData: FormData) => {
        const airportZ = z.object({
            id: z.string().optional(),
            icao: z.string().length(4, "ICAO must be 4 characters"),
            iata: z.string().length(3, "IATA must be 3 characters"),
            name: z.string().min(1, "Name must not be empty"),
            city: z.string().min(1, "City must not be empty"),
        });

        const result = airportZ.safeParse({
            id: airport?.id,
            icao: formData.get("icao") as string,
            iata: formData.get("iata") as string,
            name: formData.get("name") as string,
            city: formData.get("city") as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        const savedAirport = await upsertAirport(result.data as Airport, traconGroupId);
        toast(`Airport '${result.data.icao}' saved successfully!`, {type: 'success'});

        if (!airport) {
            router.push(`/admin/airports/airport/${savedAirport.id}`);
        }
    }

    return (
        <form action={handleSubmit}>
            <Grid container columns={2} spacing={2}>
                <Grid item xs={2} sm={1}>
                    <TextField fullWidth variant="filled" label="ICAO" name="icao" defaultValue={airport?.icao || ''}/>
                </Grid>
                <Grid item xs={2} sm={1}>
                    <TextField fullWidth variant="filled" label="IATA" name="iata" defaultValue={airport?.iata || ''}/>
                </Grid>
                <Grid item xs={2} sm={1}>
                    <TextField fullWidth variant="filled" label="Name" name="name" defaultValue={airport?.name || ''}/>
                </Grid>
                <Grid item xs={2} sm={1}>
                    <TextField fullWidth variant="filled" label="City" name="city" defaultValue={airport?.city || ''}/>
                </Grid>
                <Grid item xs={2}>
                    <FormSaveButton />
                </Grid>
            </Grid>
        </form>
    );

}