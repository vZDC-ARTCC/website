'use client';
import React from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button, Container, Stack, TextField} from "@mui/material";
import {z} from "zod";
import {toast} from "react-toastify";

export default function PrdForm() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleSubmit = (formData: FormData) => {
        const prdZ = z.object({
            origin: z.string().trim(),
            destination: z.string().trim(),
        });

        const result = prdZ.safeParse({
            origin: formData.get('origin') as string,
            destination: formData.get('destination') as string,
        });

        if (!result.success) {
            toast('Invalid form data!', {type: 'error'});
            return;
        }

        if (!result.data.origin || !result.data.destination) {
            toast('An origin OR destination is required.', {type: 'error'});
            return;
        }

        const {origin, destination} = result.data;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('origin', origin);
        newSearchParams.set('destination', destination);
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="row" spacing={2} sx={{mb: 1,}}>
                <TextField
                    fullWidth
                    variant="filled"
                    label="Origin"
                    defaultValue={searchParams.get('origin') || ''}
                    name="origin"
                />
                <TextField
                    fullWidth
                    variant="filled"
                    label="Destination"
                    defaultValue={searchParams.get('destination') || ''}
                    name="destination"
                />
            </Stack>
            <Button type="submit" variant="contained" sx={{width: '100%',}}>Search</Button>
        </form>
    );
}