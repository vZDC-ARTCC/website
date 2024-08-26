'use client';
import React, {useState} from 'react';
import {Event} from "@prisma/client";
import {toast} from "react-toastify";
import {GridActionsCellItem} from "@mui/x-data-grid";
import {Delete} from "@mui/icons-material";
import {deleteEvent} from "@/actions/event";

export default function EventDeleteButton({event}: { event: Event }) {
    const [clicked, setClicked] = useState(false);

    const handleDelete = async () => {
        if (clicked) {
            await deleteEvent(event.id);
            toast(`'${event.name}' deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting '${event.name}' will remove this event and all positions associated with it. Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }
    }

    return (
        <GridActionsCellItem
            icon={<Delete color={clicked ? "warning" : "inherit"}/>}
            label="Delete Event"
            onClick={handleDelete}
        />
    );
}