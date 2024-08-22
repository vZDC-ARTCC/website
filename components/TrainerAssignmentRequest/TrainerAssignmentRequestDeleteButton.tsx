'use client';
import React, {useState} from 'react';
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TrainingAssignmentRequest} from "@prisma/client";
import {deleteTrainingAssignmentRequest} from "@/actions/trainingAssignmentRequest";
import {useRouter} from "next/navigation";

export default function TrainerAssignmentRequestDeleteButton({request}: { request: TrainingAssignmentRequest, }) {

    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (clicked) {
            await deleteTrainingAssignmentRequest(request.id);
            toast(`Request deleted successfully!`, {type: 'success'});
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