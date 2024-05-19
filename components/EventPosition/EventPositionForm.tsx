'use client';
import React from 'react';
import {Event, EventPosition} from "@prisma/client";
import {Button, Grid, MenuItem, TextField} from "@mui/material";
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {createOrUpdateEventPosition} from "@/actions/eventPosition";

function EventPositionForm({event, eventPosition}: { event: Event, eventPosition?: EventPosition }) {

    const handleSubmit = async (formData: FormData) => {
        const eventPositionZ = z.object({
            position: z.string().min(1, "Position Name is required.").max(40, 'Position name must be less than 40 characters'),
            signupCap: z.number().optional(),
            minRating: z.number().min(-1, "Rating is invalid").max(10, "Rating is invalid"),
        });

        const result = eventPositionZ.safeParse({
            position: formData.get('position'),
            signupCap: Number(formData.get('signupCap') as string),
            minRating: Number(formData.get('minRating') as string),
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        const data = await createOrUpdateEventPosition(event, {
            ...result.data,
            id: eventPosition?.id || '',
            eventId: event.id,
        } as EventPosition);

        toast(`Position ${data.position} saved successfully!`, {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <Grid container columns={2} spacing={2}>
                <Grid item xs={2}>
                    <TextField label="Position Name" fullWidth name="position" defaultValue={eventPosition?.position}/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField label="Signup Cap (optional)" fullWidth type="number" name="signupCap"
                               defaultValue={eventPosition?.signupCap}/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField label="Minimum Rating" select fullWidth name="minRating"
                               defaultValue={eventPosition?.minRating || -1}>
                        <MenuItem value={-1}>All Ratings</MenuItem>
                        <MenuItem value={1}>OBS</MenuItem>
                        <MenuItem value={2}>S1</MenuItem>
                        <MenuItem value={3}>S2</MenuItem>
                        <MenuItem value={4}>S3</MenuItem>
                        <MenuItem value={5}>C1</MenuItem>
                        <MenuItem value={6}>C2</MenuItem>
                        <MenuItem value={7}>C3</MenuItem>
                        <MenuItem value={8}>I1</MenuItem>
                        <MenuItem value={9}>I2</MenuItem>
                        <MenuItem value={10}>I3</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={2}>
                    <Button type="submit" variant="contained" startIcon={<Save/>}>Save</Button>
                </Grid>
            </Grid>
        </form>
    );

}

export default EventPositionForm;