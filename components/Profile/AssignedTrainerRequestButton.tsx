'use client';
import React, {useState} from 'react';
import {Button} from "@mui/material";
import {toast} from "react-toastify";
import {submitTrainingAssignmentRequest} from "@/actions/trainingAssignmentRequest";

export default function AssignedTrainerRequestButton() {

    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);

        const {request, errors,} = await submitTrainingAssignmentRequest();

        if (errors) {
            toast(errors.join(' '), {type: 'error',});
            setLoading(false);
            return;
        }

        toast('Your training assignment request has been submitted!', {type: 'success',});
        setLoading(false);
    }

    return (
        <Button variant="contained" size="small" onClick={submit} disabled={loading}>Request Training
            Assignment</Button>
    );
}