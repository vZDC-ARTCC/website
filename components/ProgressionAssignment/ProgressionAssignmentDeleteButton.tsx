'use client';
import React, {useState} from 'react';
import {toast} from "react-toastify";
import {Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {GridActionsCellItem} from "@mui/x-data-grid";
import {deleteProgressionAssignment} from "@/actions/progressionAssignment";
import {User} from "next-auth";

export default function ProgressionAssignmentDeleteButton({user}: {
    user: User,
}) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteProgressionAssignment(user.id);
            toast(`Training assign deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting this remove it from this user but will NOT affect any existing training sessions.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <Tooltip title="Delete Training Assignment">
            <GridActionsCellItem
                icon={<Delete color={clicked ? "warning" : "inherit"}/>}
                label="Delete Training Assignment"
                onClick={handleClick}
            />
        </Tooltip>
    );
}