'use client';
import React from 'react';
import {RunwayInstruction} from "@prisma/client";
import {z} from "zod";
import {toast} from "react-toastify";
import {upsertInstruction} from "@/actions/airports";
import {Button, Stack, TextField} from "@mui/material";
import {Save} from "@mui/icons-material";

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
            <Stack direction="column" spacing={2}>
                <TextField fullWidth variant="filled" label="Route" name="route"
                           defaultValue={instruction?.route || ''}/>
                <TextField fullWidth variant="filled" label="Instruction" name="procedure"
                           defaultValue={instruction?.procedure || ''}/>
                <Button type="submit" variant="contained" startIcon={<Save/>}>Save</Button>
            </Stack>
        </form>
    );
}