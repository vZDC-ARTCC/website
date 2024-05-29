'use client';
import React, {useState} from 'react';
import {Lesson} from "@prisma/client";
import {toast} from "react-toastify";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {deleteLesson} from "@/actions/lesson";

export default function LessonDeleteButton({lesson}: { lesson: Lesson, }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = async () => {
        if (clicked) {
            await deleteLesson(lesson.id);
            toast(`Lesson deleted successfully!`, {type: 'success'});
        } else {
            toast(`Deleting this lesson will remove it from all progressions and training tickets.  Click again to confirm.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}