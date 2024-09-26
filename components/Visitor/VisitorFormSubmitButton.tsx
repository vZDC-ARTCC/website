'use client';
import React from 'react';
import {Button} from "@mui/material";
import {useFormStatus} from 'react-dom'

export default function VisitorFormSubmitButton() {

    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} variant="contained" size="large">Submit Application</Button>
    );
}