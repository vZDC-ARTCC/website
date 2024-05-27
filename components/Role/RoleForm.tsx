'use client';
import React from 'react';
import {User} from "next-auth";
import {Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {Role} from "@prisma/client";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {z} from "zod";
import {toast} from "react-toastify";
import {saveRoles} from "@/actions/role";

const DEV_MODE = process.env.NODE_ENV === 'development';

export default function RoleForm({sessionUser, user}: { sessionUser: User, user: User, }) {

    const handleSubmit = async (formData: FormData) => {
        const rolesZ = z.object({
            roles: z.array(z.string()),
            dossier: z.string().min(1, 'Dossier entry is required'),
        });

        const result = rolesZ.safeParse({
            roles: typeof formData.get('roles') === 'string' ? (formData.get('roles') as string)?.split(',') : formData.get('roles'),
            dossier: formData.get('dossier') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        if (!DEV_MODE && sessionUser.id === user.id) {
            toast("You cannot change your own roles.", {type: 'error'});
            return;
        }
        if (result.data.roles.includes("MENTOR") && result.data.roles.includes("INSTRUCTOR")) {
            toast("You must pick either MENTOR or INSTRUCTOR, not both.", {type: 'error'})
            return;
        }

        await saveRoles(user, result.data.roles as Role[], result.data.dossier);
        toast("Roles saved successfully.", {type: 'success'});
    };

    return (
        <>
            {user.controllerStatus === "NONE" &&
                <Typography>
                    User is not a rostered controller.
                </Typography>}
            {user.controllerStatus !== "NONE" && <form action={handleSubmit}>
                <Stack direction="column" spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Role(s)</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role-select"
                            multiple
                            name="roles"
                            defaultValue={user.roles}
                            label="Staff Position(s)"
                            renderValue={(selected) => (
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value}/>
                                    ))}
                                </Box>
                            )}
                        >
                            {Object.keys(Role).map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField variant="filled" fullWidth label="Dossier Entry*" name="dossier"/>
                    <Box>
                        <FormSaveButton/>
                    </Box>
                </Stack>
            </form>}
        </>
    );

}