'use client';
import React, {useState} from 'react';
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {CommonMistake} from "@prisma/client";
import {deleteMistake} from "@/actions/mistake";

export default function CommonMistakeDeleteButton({mistake}: { mistake: CommonMistake, }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteMistake(mistake.id);
            toast(`Mistake deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting this remove the common mistake from every training ticket.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}