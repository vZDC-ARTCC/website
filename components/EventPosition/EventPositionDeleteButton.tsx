'use client';
import React, {useState} from 'react';
import {EventPosition} from "@prisma/client";
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {deleteEventPosition} from "@/actions/eventPosition";

function EventPositionDeleteButton({eventPosition}: { eventPosition: EventPosition }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteEventPosition(eventPosition.id);
            toast(`'${eventPosition.position}' deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting '${eventPosition.position}' will remove all controllers signed up for it.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}

export default EventPositionDeleteButton;