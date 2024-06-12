'use client';
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {z} from "zod";
import {toast} from "react-toastify";
import {Autocomplete, Button, Stack, TextField} from "@mui/material";
import {User} from "next-auth";

export default function CidForm({basePath, controllers, initialCid}: {
    basePath: string,
    controllers: User[],
    initialCid?: string
}) {

    const router = useRouter();
    const [controller, setController] = useState(initialCid);

    const handleSubmit = () => {
        if (!controller) {
            router.push(`${basePath}`, {
                scroll: true,
            });
            return;
        }
        const cidZ = z.number().int().positive("CID must be numbers").min(1, "CID must be positive numbers");
        const result = cidZ.safeParse(Number(controller));
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
                <Autocomplete
                    fullWidth
                    options={controllers}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                    value={controllers.find((u) => u.cid === controller) || null}
                    onChange={(event, newValue) => {
                        setController(newValue ? newValue.cid : '');
                    }}
                    renderInput={(params) => <TextField {...params} variant="filled" label="Controller"/>}
                />
                <Button type="submit" variant="contained" size="large">Search</Button>
            </Stack>
        </form>
    );
}