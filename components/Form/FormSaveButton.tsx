'use client';
import React from 'react';
import {Save} from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import {useFormStatus} from 'react-dom'

export default function FormSaveButton({text = "Save", icon = <Save/>}: { text?: string, icon?: React.ReactNode }) {

    const { pending } = useFormStatus();

    return (
        <LoadingButton type="submit" loading={pending} variant="contained" size="large" startIcon={icon}>
            {text}
        </LoadingButton>
    );
}