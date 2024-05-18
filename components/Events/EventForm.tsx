'use client';
import React from 'react';
import {Event} from "@prisma/client";
import {Grid, TextField} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {UploadButton} from "@/lib/uploadthing";

export default function EventForm({event}: { event?: Event }) {


    const handleSubmit = async (formData: FormData) => {

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form action={handleSubmit}>
                <Grid container columns={2} spacing={2}>
                    <Grid item xs={2} md={1}>
                        <TextField variant="filled" fullWidth name="name" label="Name"
                                   defaultValue={event?.name || ''}/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <TextField variant="filled" fullWidth name="host" label="Host"
                                   helperText="Leave blank if this ARTCC is hosting the event"
                                   defaultValue={event?.host || ''}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField variant="filled" multiline rows={5} fullWidth name="description" label="Description"
                                   defaultValue={event?.description || ''}/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker name="start" defaultValue={dayjs(event?.start)} label="Start"/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker name="end" defaultValue={dayjs(event?.end)} label="End"/>
                    </Grid>
                    <Grid item xs={2}>
                        <UploadButton endpoint="eventBannerUploader"
                                      onClientUploadComplete={(data) => {
                                          console.log(data);
                                      }}
                        />
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );

}