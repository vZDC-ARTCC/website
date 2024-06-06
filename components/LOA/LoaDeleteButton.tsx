'use client';
import React, {useState} from 'react';
import {LOA} from "@prisma/client";
import {toast} from "react-toastify";
import {Button, IconButton, Tooltip} from "@mui/material";
import {Delete, Storage} from "@mui/icons-material";
import {deleteLoa} from "@/actions/loa";

export default function LoaDeleteButton({loa, icon}: { loa: LOA, icon?: boolean, }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteLoa(loa.id);
            toast(`LOA deleted successfully!`, {type: 'success'});
        } else {
            toast(`Are you sure you want to mark this LOA as inactive? This action is irreversible! Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    if (icon) {
        return (
            <Tooltip title="Mark as inactive">
                <IconButton color="inherit" onClick={handleClick}>
                    {clicked ? <Storage color="warning"/> : <Storage/>}
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Button variant="outlined" color="inherit" onClick={handleClick}
                startIcon={clicked ? <Delete color="warning"/> : <Delete/>}>
            Mark as Inactive
        </Button>
    );
}