'use client';
import React from 'react';
import {Check} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {approveReleaseRequest} from "@/actions/trainingAssignmentRelease";
import {toast} from "react-toastify";

export default function TrainerReleaseRequestApproveButton({studentId}: { studentId: string, }) {
    return (
        <Tooltip title="Approve Release Request">
            <IconButton onClick={async () => {
                await approveReleaseRequest(studentId);
                toast('Release request approved successfully!', {type: 'success'});
            }}>
                <Check/>
            </IconButton>
        </Tooltip>
    );
}