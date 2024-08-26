'use client';
import React from 'react';
import {Check, Delete} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {approveReleaseRequest} from "@/actions/trainingAssignmentRelease";
import {toast} from "react-toastify";
import {GridActionsCellItem} from "@mui/x-data-grid";

export default function TrainerReleaseRequestApproveButton({studentId}: { studentId: string, }) {
    return (
        <Tooltip title="Approve Release Request">
            <GridActionsCellItem
                icon={<Check/>}
                label="Approve Release Request"
                onClick={async () => {
                    await approveReleaseRequest(studentId);
                    toast('Release request approved successfully!', {type: 'success'});
                }}
            />
        </Tooltip>
    );
}