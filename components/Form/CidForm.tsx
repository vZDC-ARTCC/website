'use client';
import React from 'react';
import {useRouter} from "next/navigation";
import {z} from "zod";
import {toast} from "react-toastify";
import {Button, Stack, TextField} from "@mui/material";

export default function CidForm({basePath, initialCid}: { basePath: string, initialCid?: string }) {
    const router = useRouter();
    const cidZ = z.number().int().positive("CID must be numbers").min(1, "CID must be positive numbers");
    const handleSubmit = (formData: FormData) => {
        if (!formData.get('cid')) {
            router.push(`${basePath}`, {
                scroll: true,
            });
            return;
        }
        const result = cidZ.safeParse(Number(formData.get('cid')));
        if (!result.success) {
            const message = result.error.issues.map((issue) => issue.message).join(", ");
            toast(message, {type: "error"});
        } else {
            router.push(`${basePath}/${result.data}`, {
                scroll: true,
            });
        }
    }

    return (
        <form action={handleSubmit} style={{width: '100%',}}>
            <Stack direction={{xs: 'column', md: 'row',}} spacing={2}>
                <TextField fullWidth type="number" name="cid" label="VATSIM CID"
                           variant="filled"/>
                <Button type="submit" variant="contained" size="large">Search</Button>
            </Stack>
        </form>
    );
}