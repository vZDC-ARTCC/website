'use client';
import React, {useState} from 'react';
import {IconButton, Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {deleteTrainingRelease} from "@/actions/trainingAssignmentRelease";
import {GridActionsCellItem} from "@mui/x-data-grid";

export default function TrainerReleaseDeleteButton({studentId}: { studentId: string }) {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (clicked) {
            await deleteTrainingRelease(studentId);
            toast(`Training release request deleted successfully!`, {type: 'success'});
            router.replace('/training/requests');
        } else {
            toast(`Click again to confirm deletion.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <Tooltip title="Delete Trainer Release Request">
            <GridActionsCellItem
                icon={<Delete color={clicked ? "warning" : "inherit"}/>}
                label="Delete Trainer Release Request"
                onClick={handleClick}
            />
        </Tooltip>
    );
}