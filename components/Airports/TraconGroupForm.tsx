'use client';
import React from 'react';
import {TraconGroup} from "@prisma/client";
import {Button, Stack, TextField} from "@mui/material";
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {upsertTraconGroup} from "@/actions/airports";

export default function TraconGroupForm({traconGroup}: { traconGroup?: TraconGroup }) {

    const handleSubmit = async (formData: FormData) => {
        const traconGroupZ = z.object({
            id: z.string().optional(),
            name: z.string().min(1, "Name must not be empty"),
        });

        const result = traconGroupZ.safeParse({
            id: traconGroup?.id,
            name: formData.get("name") as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        await upsertTraconGroup(result.data as TraconGroup);
        toast(`Tracon group '${result.data.name}' saved successfully!`, {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <TextField fullWidth variant="filled" label="Name*" name="name" defaultValue={traconGroup?.name || ''}/>
                <Button type="submit" variant="contained" size="large" startIcon={<Save/>}>Save</Button>
            </Stack>

        </form>
    );
}