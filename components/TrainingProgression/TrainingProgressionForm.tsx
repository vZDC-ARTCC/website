'use client';
import React from 'react';
import {TrainingProgression} from "@prisma/client";
import Form from "next/form";
import {Box, FormControlLabel, Stack, Switch, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateTrainingProgression} from "@/actions/trainingProgression";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function TrainingProgressionForm({trainingProgression}: { trainingProgression?: TrainingProgression }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const {trainingProgression: newTp, errors} = await createOrUpdateTrainingProgression(formData);

        if (errors) {
            toast.error(errors.map(e => e.message).join('. '));
            return;
        }

        toast.success(trainingProgression?.id ? "Training progression updated!" : "Training progression created!");
        if (!trainingProgression?.id) {
            router.push(`/training/progressions/${newTp.id}/steps`);
        }
    }

    return (
        <Form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <input type="hidden" name="id" defaultValue={trainingProgression?.id || ''}/>
                <TextField variant="filled" label="Name" name="name" fullWidth required
                           defaultValue={trainingProgression?.name || ''}/>
                <FormControlLabel disabled name="autoAssignNewHomeObs"
                                  control={<Switch defaultChecked={trainingProgression?.autoAssignNewHomeObs}/>}
                                  label="Auto assign to NEW HOME OBS? (coming soon)"/>
                <FormControlLabel disabled name="autoAssignNewVisitor"
                                  control={<Switch defaultChecked={trainingProgression?.autoAssignNewVisitor}/>}
                                  label="Auto assign to NEW VISITOR? (coming soon)"/>
                <Box>
                    <FormSaveButton/>
                </Box>
            </Stack>

        </Form>
    );
}

