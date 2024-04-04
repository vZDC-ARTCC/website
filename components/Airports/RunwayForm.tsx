'use client';

import React from 'react';
import {Runway} from "@prisma/client";
import {Box, Button, Stack, TextField} from "@mui/material";
import {z} from "zod";
import {toast} from "react-toastify";
import {upsertRunway} from "@/actions/airports";
import {Save} from "@mui/icons-material";

export default function RunwayForm({runway, airportId}: { runway?: Runway, airportId: string, }) {

    const handleSubmit = async (formData: FormData) => {

        const runwayZ = z.object({
            id: z.string().optional(),
            name: z.string().min(1, "Name is required"),
        });

        const result = runwayZ.safeParse({
            id: runway?.id,
            name: formData.get('name') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        await upsertRunway(result.data as Runway, airportId);
        toast(`Runway '${result.data.name}' saved successfully!`, {type: 'success'});

    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <TextField fullWidth variant="filled" label="Identifier" name="name" defaultValue={runway?.name || ''}/>
                <Box>
                    <Button type="submit" variant="contained" size="large" startIcon={<Save/>}>Save</Button>
                </Box>
            </Stack>
        </form>
    );
}