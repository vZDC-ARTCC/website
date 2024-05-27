'use client';
import React from 'react';
import {useFormStatus} from "react-dom";
import {Button} from "@mui/material";
import {Check} from "@mui/icons-material";

export default function StaffingRequestDecisionButton() {

    const {pending} = useFormStatus();

    return (
        <Button type="submit" disabled={pending} variant="contained" size="large" startIcon={<Check/>}>Close</Button>
    );
}