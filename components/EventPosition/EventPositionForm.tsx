'use client';
import React from 'react';
import {Event, EventPosition} from "@prisma/client";
import {Grid, MenuItem, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {createOrUpdateEventPosition} from "@/actions/eventPosition";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {useRouter} from "next/navigation";

function EventPositionForm({event, eventPosition}: { event: Event, eventPosition?: EventPosition }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const {eventPosition, errors} = await createOrUpdateEventPosition(formData);
        if (errors) {
            toast(errors.map(e => e.message).join('.  '), {type: 'error'});
            return;
        }

        toast(`Position ${eventPosition.position} saved successfully!`, {type: 'success'});
        router.push(`/admin/events/edit/${event.id}/positions`);
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="eventId" value={event.id}/>
            <input type="hidden" name="id" value={eventPosition?.id}/>
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
                    <FormSaveButton />
                </Grid>
            </Grid>
        </form>
    );

}

export default EventPositionForm;