'use client';
import React from 'react';
import {RunwayInstruction} from "@prisma/client";
import {toast} from "react-toastify";
import {upsertInstruction} from "@/actions/airports";
import {Grid, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function ProcedureForm({instruction, runwayId}: { instruction?: RunwayInstruction, runwayId: string, }) {
    const handleSubmit = async (formData: FormData) => {

        const {instruction, errors} = await upsertInstruction(formData);
        if (errors) {
            toast(errors.map(e => e.message).join('.  '), {type: 'error'});
            return;
        }

        toast(`Procedure '${instruction.route}' saved successfully!`, {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="id" value={instruction?.id}/>
            <input type="hidden" name="runwayId" value={runwayId}/>
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