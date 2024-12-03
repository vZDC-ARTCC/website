'use client';
import React, {useState} from 'react';
import {TrainingProgression} from "@prisma/client";
import {User} from "next-auth";
import {Done} from "@mui/icons-material";
import {assignNextProgressionOrRemove} from "@/actions/progressionAssignment";
import LoadingButton from "@mui/lab/LoadingButton";

export default function ProgressionCompleteButton({user, progression}: {
    user: User,
    progression: TrainingProgression
}) {

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        assignNextProgressionOrRemove(user.id, progression, true).then(() => setLoading(false));
    }

    return (
        <LoadingButton variant="contained" size="large" color="success" startIcon={<Done/>} loading={loading}
                       onClick={handleClick}>Complete Progression</LoadingButton>
    );
}