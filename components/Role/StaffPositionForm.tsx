'use client';
import React from 'react';
import {User} from "next-auth";
import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {StaffPosition} from "@prisma/client";
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {saveStaffPositions} from "@/actions/role";

function StaffPositionForm({user}: { user: User }) {

    const handleSubmit = async (formData: FormData) => {
        const staffPositionsZ = z.object({
            staffPositions: z.array(z.string()),
            dossier: z.string().min(1, 'Dossier entry is required'),
        });

        const result = staffPositionsZ.safeParse({
            staffPositions: typeof formData.get('staffPositions') === 'string' ? (formData.get('staffPositions') as string)?.split(',') : formData.get('staffPositions'),
            dossier: formData.get('dossier') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }


        await saveStaffPositions(user, result.data.staffPositions as StaffPosition[], result.data.dossier);
        toast("Staff positions saved!", {type: 'success'})

    }

    return (
        <>
            {user.controllerStatus === "NONE" &&
                <Typography>
                    User is not a rostered controller.
                </Typography>}
            {user.controllerStatus !== "NONE" && <form action={handleSubmit}>
                <Stack direction="column" spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="staff-position-select-label">Staff Position(s)</InputLabel>
                        <Select
                            labelId="staff-position-select-label"
                            id="staff-position-select"
                            multiple
                            name="staffPositions"
                            defaultValue={user.staffPositions}
                            label="Staff Position(s)"
                            renderValue={(selected) => (
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value}/>
                                    ))}
                                </Box>
                            )}
                        >
                            {Object.keys(StaffPosition).map((position) => (
                                <MenuItem key={position} value={position}>{position}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField variant="filled" fullWidth label="Dossier Entry*" name="dossier"/>
                    <Box>
                        <Button type="submit" variant="contained" startIcon={<Save/>}>Save</Button>
                    </Box>
                </Stack>
            </form>}
        </>

    );
}

export default StaffPositionForm;