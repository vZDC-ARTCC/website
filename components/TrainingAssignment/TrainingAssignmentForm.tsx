'use client';
import React, {useState} from 'react';
import {TrainingAssignment, TrainingAssignmentRequest} from "@prisma/client";
import {User} from "next-auth";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {Autocomplete, Box, Chip, Stack, TextField} from "@mui/material";
import {getRating} from "@/lib/vatsim";
import {toast} from "react-toastify";
import {saveTrainingAssignment} from "@/actions/trainingAssignment";
import {useRouter} from "next/navigation";

export default function TrainingAssignmentForm({
                                                   trainingAssignment,
                                                   otherTrainerIds,
                                                   trainingRequest,
                                                   requestStudent,
                                                   allUsers,
                                               }: {
    trainingAssignment?: TrainingAssignment,
    otherTrainerIds?: string[],
    trainingRequest?: TrainingAssignmentRequest,
    requestStudent?: User,
    allUsers: User[],
}) {

    const [student, setStudent] = useState(requestStudent?.id);
    const [primaryTrainer, setPrimaryTrainer] = useState(trainingAssignment?.primaryTrainerId);
    const [otherTrainers, setOtherTrainers] = useState(otherTrainerIds || []);
    const allTrainers = allUsers.filter((u) => u.roles.includes('INSTRUCTOR') || u.roles.includes('MENTOR'));
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {

        formData.set('id', trainingAssignment?.id || '');
        formData.set('trainingRequestId', trainingRequest?.id || '');
        formData.set('student', student || '');
        formData.set('primaryTrainer', primaryTrainer || '');
        formData.set('otherTrainers', otherTrainers.join(','));

        const {assignment, errors} = await saveTrainingAssignment(formData);

        if (errors) {
            toast(errors.map((error) => error.message).join('. '), {type: 'error'});
            return;
        }

        toast('Training assignment saved successfully!', {type: 'success'});
        if (!trainingAssignment || trainingRequest) {
            router.push(`/training/assignments/${assignment.id}`);
        }
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <Autocomplete
                    disabled={!!trainingRequest || !!trainingAssignment}
                    options={allUsers}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                    value={allUsers.find((u) => u.id === student) || null}
                    onChange={(event, newValue) => {
                        setStudent(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => <TextField {...params} required label="Student"/>}
                />
                <Autocomplete
                    options={allTrainers}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid}) - ${getRating(option.rating)}`}
                    value={allTrainers.find((u) => u.id === primaryTrainer) || null}
                    onChange={(event, newValue) => {
                        setPrimaryTrainer(newValue ? newValue.id : '');
                        if (otherTrainers.includes(newValue?.id || '')) {
                            setOtherTrainers((prev) => prev.filter((id) => id !== newValue?.id));
                        }
                    }}
                    renderInput={(params) => <TextField {...params} required label="Primary Trainer"/>}
                />
                <Autocomplete
                    multiple
                    options={allTrainers}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid}) - ${getRating(option.rating)}`}
                    value={allTrainers.filter((u) => otherTrainers.includes(u.id))}
                    onChange={(event, newValue) => {
                        if (newValue.filter((trainer) => trainer.id === primaryTrainer).length > 0) {
                            toast('Primary trainer cannot be selected as an additional trainer.', {type: 'error'});
                        } else {
                            setOtherTrainers(newValue.map((trainer) => trainer.id));
                        }
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <Chip {...getTagProps({index})} label={`${option.firstName} ${option.lastName}`}/>
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Other Trainers"/>}
                />
                <Box>
                    <FormSaveButton/>
                </Box>
            </Stack>

        </form>
    );
}