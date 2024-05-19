'use client';
import React, {useState} from 'react';
import {Event} from "@prisma/client";
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {deleteEvent} from "@/actions/event";

export default function EventDeleteButton({event}: { event: Event }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteEvent(event.id);
            toast(`'${event.name}' deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting '${event.name}' will remove this events and all positions associated with it.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}