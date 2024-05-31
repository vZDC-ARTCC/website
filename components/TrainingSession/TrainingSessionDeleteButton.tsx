'use client';
import React, {useState} from 'react';
import {TrainingSession} from "@prisma/client";
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {deleteTrainingSession} from "@/actions/trainingSession";

export default function TrainingSessionDeleteButton({trainingSession}: { trainingSession: TrainingSession, }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteTrainingSession(trainingSession.id);
            toast(`Training session deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting this remove it from all records.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}