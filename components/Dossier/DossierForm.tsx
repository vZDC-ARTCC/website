'use client';
import React, {useRef} from 'react';
import {Button, Stack, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {writeDossier} from "@/actions/dossier";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function DossierForm({cid}: { cid: string, }) {

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const messageZ = z.string().min(1, 'Message must be at least 1 character long');
        const message = messageZ.safeParse(formData.get('message') as string);
        if (!message.success) {
            toast(message.error.message, {type: 'error'});
            return;
        }
        await writeDossier(message.data, cid);
        toast('Dossier entry added', {type: 'success'});
        formRef.current?.reset();
    }

    return (
        <form ref={formRef} action={handleSubmit}>
            <Stack direction="row" spacing={1}>
                <TextField variant="filled" fullWidth name="message" label="Message*"/>
                <FormSaveButton />
            </Stack>
        </form>
    );
}