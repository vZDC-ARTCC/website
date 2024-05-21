'use client';
import React from 'react';
import {EventPosition} from "@prisma/client";
import {User} from "next-auth";
import {Button} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useFormStatus} from "react-dom";

function EventPositionSignupButton() {

    const { pending } = useFormStatus();

    return (
        <Button variant="outlined" color="inherit" disabled={pending} startIcon={<Add />} size="small" type="submit">Signup</Button>
    );
}

export default EventPositionSignupButton;