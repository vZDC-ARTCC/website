'use client';
import React from 'react';
import {Lesson, TrainingProgression, TrainingProgressionStep} from "@prisma/client";
import Form from "next/form";
import {Autocomplete, Box, FormControlLabel, Stack, Switch, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateTrainingProgressionStep} from "@/actions/trainingProgressionStep";
import {toast} from "react-toastify";

export type TrainingProgressionStepWithLesson = TrainingProgressionStep & {
    lesson: Lesson,
};

export default function TrainingProgressionStepForm({
                                                        allLessons,
                                                        trainingProgression,
                                                        trainingProgressionStep,
                                                        onSubmit
                                                    }: {
    allLessons: Lesson[],
    trainingProgression: TrainingProgression,
    trainingProgressionStep?: TrainingProgressionStepWithLesson,
    onSubmit?: () => void
}) {

    const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(trainingProgressionStep?.lesson || null);

    const handleSubmit = async (data: FormData) => {
        if (!selectedLesson) {
            toast.error('Please select a lesson');
            return;
        }

        data.set('lessonId', selectedLesson.id);

        const {errors} = await createOrUpdateTrainingProgressionStep(data);

        if (errors) {
            toast.error(errors.map((e) => e.message).join('. '));
            return;
        }

        toast.success(`Training progression step saved successfully`);
        setSelectedLesson(null);
        onSubmit?.();
    }

    return (
        <Form action={handleSubmit}>
            <input type="hidden" name="stepId" value={trainingProgressionStep?.id || ''}/>
            <input type="hidden" name="progressionId" value={trainingProgression.id}/>
            <Stack direction="column" spacing={2}>
                <Autocomplete
                    options={allLessons}
                    getOptionLabel={(option) => `${option.identifier} - ${option.name}`}
                    value={selectedLesson}
                    onChange={(event, newValue) => {
                        setSelectedLesson(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Lesson (search name or identifier)"/>}
                />
                <FormControlLabel name="optional"
                                  control={<Switch defaultChecked={trainingProgressionStep?.optional}/>}
                                  label="Optional?"/>
                <Box>
                    <FormSaveButton/>
                </Box>
            </Stack>
        </Form>
    );

}