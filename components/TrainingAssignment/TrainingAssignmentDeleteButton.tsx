'use client'
import React, {useState} from 'react';
import {TrainingAssignment} from "@prisma/client";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {deleteTrainingAssignment} from "@/actions/trainingAssignment";

export default function TrainingAssignmentDeleteButton({assignment}: { assignment: TrainingAssignment, }) {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (clicked) {
            await deleteTrainingAssignment(assignment.id);
            toast(`Training assignment deleted successfully!`, {type: 'success'});
            router.replace('/training/requests');
        } else {
            toast(`Click again to confirm deletion.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}