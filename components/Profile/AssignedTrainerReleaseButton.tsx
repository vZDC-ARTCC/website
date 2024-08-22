'use client';
import React, {useState} from 'react';
import {Button} from "@mui/material";
import {toast} from "react-toastify";
import {releaseTrainingAssignment} from "@/actions/trainingAssignmentRelease";

export default function AssignedTrainerReleaseButton() {

    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        await releaseTrainingAssignment();
        toast('Your training release request has been created.', {type: 'success',});
        setLoading(false);
    }

    return (
        <Button variant="text" size="small" onClick={submit} disabled={loading} color="error">Request to Release All
            Trainers</Button>
    );
}