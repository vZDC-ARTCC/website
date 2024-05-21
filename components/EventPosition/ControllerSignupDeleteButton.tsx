'use client';
import React from 'react';
import {useFormStatus} from "react-dom";
import {Button, IconButton} from "@mui/material";
import {Close, Delete} from "@mui/icons-material";

function ControllerSignupDeleteButton({ iconOnly }: { iconOnly?: boolean}) {
    const { pending } = useFormStatus();

    if (iconOnly) {
        return (
            <IconButton type="submit" size="small" disabled={pending}>
                <Close fontSize="small" />
            </IconButton>
        );
    }
    return (
        <Button variant="contained" disabled={pending} startIcon={<Delete />} size="small" type="submit">Delete Signup</Button>
    );
}

export default ControllerSignupDeleteButton;