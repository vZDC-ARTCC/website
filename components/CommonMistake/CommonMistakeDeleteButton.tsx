'use client';
import React, {useState} from 'react';
import {GridActionsCellItem} from "@mui/x-data-grid";
import {Delete} from "@mui/icons-material";
import {toast} from "react-toastify";
import {deleteMistake} from "@/actions/mistake";
import {Tooltip} from "@mui/material";
import {CommonMistake} from "@prisma/client";

export default function CommonMistakeDeleteButton({mistake}: { mistake: CommonMistake }) {
    const [clicked, setClicked] = useState(false);

    const handleDelete = async () => {
        if (clicked) {
            await deleteMistake(mistake.id);
            toast(`'${mistake.name}' deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting '${mistake.name}' will remove this mistake. Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }
    }

    return (
        <Tooltip title="Delete Mistake">
            <GridActionsCellItem
                icon={<Delete color={clicked ? "warning" : "inherit"}/>}
                label="Delete Mistake"
                onClick={handleDelete}
            />
        </Tooltip>
    );
}