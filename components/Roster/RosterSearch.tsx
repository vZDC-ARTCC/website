'use client';
import React from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button, Stack, TextField} from "@mui/material";
import {z} from "zod";

export default function RosterSearch() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {push} = useRouter();

    const handleSubmit = (formData: FormData) => {
        const searchZ = z.string().trim().optional().safeParse(formData.get('search'));
        if (!searchZ.success) {
            return;
        }
        const search = searchZ.data;
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        push(`${pathname}?${params.toString()}`)
    };

    return (
        <form action={handleSubmit}>
            <Stack direction="row" spacing={2}>
                <TextField variant="filled" fullWidth name="search" label="Search by name or CID"
                           defaultValue={searchParams.get('search')}/>
                <Button type="submit" variant="contained" size="large">Search</Button>
            </Stack>
        </form>
    );
}