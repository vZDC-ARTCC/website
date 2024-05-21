'use client';
import React from 'react';
import {RunwayInstruction} from "@prisma/client";
import {z} from "zod";
import {toast} from "react-toastify";
import {upsertInstruction} from "@/actions/airports";
import {Button, Grid, Stack, TextField} from "@mui/material";
import {Save} from "@mui/icons-material";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function ProcedureForm({instruction, runwayId}: { instruction?: RunwayInstruction, runwayId: string, }) {
    const handleSubmit = async (formData: FormData) => {

        const runwayZ = z.object({
            id: z.string().optional(),
            route: z.string().min(1, "Route is required"),
            procedure: z.string().min(1, "Procedure is required"),
        });

        const result = runwayZ.safeParse({
            id: instruction?.id,
            route: formData.get('route') as string,
            procedure: formData.get('procedure') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        await upsertInstruction(result.data as RunwayInstruction, runwayId);
        toast(`Procedure '${result.data.route}' saved successfully!`, {type: 'success'});

    }

    return (
        <form action={handleSubmit}>
            <Grid container columns={2} spacing={2}>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" label="Route" name="route" defaultValue={instruction?.route || ''}/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" label="Instruction" name="procedure" defaultValue={instruction?.procedure || ''}/>
                </Grid>
                <Grid item xs={2}>
                    <FormSaveButton />
                </Grid>
            </Grid>
        </form>
    );
}