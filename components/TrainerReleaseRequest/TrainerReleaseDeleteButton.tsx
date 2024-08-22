import React, {useState} from 'react';
import {IconButton, Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {deleteTrainingAssignment} from "@/actions/trainingAssignment";
import {toast} from "react-toastify";
import {deleteTrainingRelease} from "@/actions/trainingAssignmentRelease";

export default function TrainerReleaseDeleteButton({studentId}: { studentId: string }) {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (clicked) {
            await deleteTrainingRelease(studentId);
            toast(`Training release request deleted successfully!`, {type: 'success'});
            router.replace('/training/requests');
        } else {
            toast(`Click again to confirm deletion.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <IconButton onClick={handleClick}>
            {clicked ? <Delete color="warning"/> : <Delete/>}
        </IconButton>
    );
}