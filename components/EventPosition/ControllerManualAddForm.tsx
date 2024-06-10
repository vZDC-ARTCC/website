'use client';
import React from 'react';
import {EventPosition} from "@prisma/client";
import {Box, MenuItem, Stack, TextField} from "@mui/material";
import {User} from "next-auth";
import {getRating} from "@/lib/vatsim";
import {z} from "zod";
import {toast} from "react-toastify";
import {forceAssignPosition} from "@/actions/eventPosition";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function ControllerManualAddForm({eventPositions, users}: {
    eventPositions: EventPosition[],
    users: User[]
}) {

    const handleSubmit = async (formData: FormData) => {
        const assignZ = z.object({
            position: z.string(),
            controller: z.string(),
        });

        const result = assignZ.safeParse({
            position: formData.get('position') as string,
            controller: formData.get('controller') as string,
        });

        if (!result.success) {
            toast('Invalid form data', { type: 'error' });
            return;
        }

        const data = await forceAssignPosition(result.data.position, result.data.controller);
        toast(`Assigned ${data.eventPosition.position} to ${data.controller.firstName} ${data.controller.lastName}`, { type: 'success' });
    }

    return (
        <form action={handleSubmit}>
            <Stack direction={{ xs: 'column', md: 'row', }} spacing={2} alignItems="center">
                <TextField variant="filled" fullWidth select name="position" label="Position" required>
                    {eventPositions.map((position) => (
                        <MenuItem key={position.id} value={position.id}>{position.position}</MenuItem>
                    ))}
                </TextField>
                <TextField variant="filled" fullWidth select name="controller" label="Controller" required>
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {getRating(user.rating)}
                        </MenuItem>
                    ))}
                </TextField>
                <Box>
                    <FormSaveButton />
                </Box>
            </Stack>
        </form>
    );
}