'use client';
import React from 'react';
import {User} from "next-auth";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {Grid, TextField} from "@mui/material";
import StaffingRequestSubmitButton from "@/components/StaffingRequest/StaffingRequestSubmitButton";

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY || '';

export default function StaffingRequestForm({user}: { user: User, }) {

    const handleSubmit = async (formData: FormData) => {

    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
            <form action={handleSubmit}>
                <Grid container columns={2} spacing={2}>
                    <Grid item xs={2} sm={1}>
                        <TextField fullWidth variant="filled" name="pilotName" label="Your Name"
                                   defaultValue={user.fullName} disabled/>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <TextField fullWidth variant="filled" name="pilotEmail" label="Your Email"
                                   defaultValue={user.email} disabled/>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <TextField fullWidth variant="filled" name="pilotCid" label="Your VATSIM CID"
                                   defaultValue={user.cid} disabled/>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <TextField fullWidth variant="filled" name="name" label="Event Name" required/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField fullWidth required multiline rows={5} variant="filled" name="description"
                                   label="Description"
                                   helperText="Include airports, times, routes, and any other staffing requirements needed."/>
                    </Grid>
                    <Grid item xs={2}>
                        <StaffingRequestSubmitButton/>
                    </Grid>
                </Grid>
            </form>
        </GoogleReCaptchaProvider>
    );
}