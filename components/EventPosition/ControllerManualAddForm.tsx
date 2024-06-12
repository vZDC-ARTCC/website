'use client';
import React, {useState} from 'react';
import {EventPosition} from "@prisma/client";
import {Autocomplete, Box, Stack, TextField} from "@mui/material";
import {User} from "next-auth";
import {getRating} from "@/lib/vatsim";
import {toast} from "react-toastify";
import {forceAssignPosition} from "@/actions/eventPosition";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function ControllerManualAddForm({eventPositions, users}: {
    eventPositions: EventPosition[],
    users: User[]
}) {

    const [controller, setController] = useState('');
    const [position, setPosition] = useState('');

    const handleSubmit = async (formData: FormData) => {

        const {eventPosition, controller, errors} = await forceAssignPosition(formData);

        if (errors) {
            toast(errors[0].message, {type: 'error'});
            return;
        }

        toast(`Assigned ${eventPosition.position} to ${controller.firstName} ${controller.lastName}`, {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="position" value={position}/>
            <input type="hidden" name="controller" value={controller}/>
            <Stack direction={{ xs: 'column', md: 'row', }} spacing={2} alignItems="center">
                <Autocomplete
                    fullWidth
                    options={eventPositions}
                    getOptionLabel={(option) => `${option.position}`}
                    value={eventPositions.find((p) => p.id === position) || null}
                    onChange={(event, newValue) => {
                        setPosition(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => <TextField {...params} label="Position"/>}
                />
                <Autocomplete
                    fullWidth
                    options={users}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid}) - ${getRating(option.rating)}`}
                    value={users.find((u) => u.id === controller) || null}
                    onChange={(event, newValue) => {
                        setController(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => <TextField {...params} label="Controller"/>}
                />
                <Box>
                    <FormSaveButton />
                </Box>
            </Stack>
        </form>
    );
}