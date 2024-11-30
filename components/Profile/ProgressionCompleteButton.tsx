'use client';
import React from 'react';
import {TrainingProgression} from "@prisma/client";
import {User} from "next-auth";
import {Button} from "@mui/material";
import {Done} from "@mui/icons-material";
import {assignNextProgressionOrRemove} from "@/actions/progressionAssignment";

function ProgressionCompleteButton({user, progression}: { user: User, progression: TrainingProgression }) {
    return (
        <Button variant="contained" size="large" color="success" startIcon={<Done/>}
                onClick={() => assignNextProgressionOrRemove(user.id, progression, true)}>Complete Progression</Button>
    );
}

export default ProgressionCompleteButton;