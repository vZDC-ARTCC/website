'use client';
import React from 'react';
import {FileCategory} from "@prisma/client";
import {TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {z} from "zod";
import {toast} from "react-toastify";
import {createOrUpdateFileCategory} from "@/actions/files";

export default function FileCategoryForm({fileCategory}: { fileCategory?: FileCategory }) {

    const handleSubmit = async (formData: FormData) => {
        const fileCategoryZ = z.object({
            name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
        });

        const result = fileCategoryZ.safeParse({
            name: formData.get('name') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        const data = await createOrUpdateFileCategory({
            id: fileCategory?.id || '',
            ...result.data,
        });

        toast(`File category ${data.name} saved successfully!`, {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <TextField fullWidth required variant="filled" name="name" label="Name"
                       defaultValue={fileCategory?.name || ''} sx={{mb: 1,}}/>
            <FormSaveButton/>
        </form>
    );

}