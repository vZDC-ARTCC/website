'use client';
import {Button, Stack, TextField} from '@mui/material';
import React from 'react';
import {z} from "zod";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import Form from "next/form";

export default function IcaoForm({basePath}: { basePath: string }) {

    const router = useRouter();
    const icaoZ = z.string().toUpperCase().length(4, "ICAO must be 4 characters");
    const handleSubmit = (formData: FormData) => {
        if (!formData.get('icao')) {
            router.push(`${basePath}`, {
                scroll: true,
            });
            return;
        }
        const result = icaoZ.safeParse(formData.get('icao'));
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
        <Form action={handleSubmit} style={{width: '100%',}}>
            <Stack direction={{xs: 'column', md: 'row',}} spacing={2}>
                <TextField slotProps={{htmlInput: {style: {textTransform: "uppercase"}}}} fullWidth name="icao"
                           label="ICAO"
                           placeholder="KIAD" variant="filled" helperText="Must be 4 characters long"/>
                <Button type="submit" variant="contained" size="large">Search</Button>
            </Stack>
        </Form>
    );

}