'use client';
import React from 'react';
import {User} from "next-auth";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {Grid, TextField} from "@mui/material";
import StaffingRequestSubmitButton from "@/components/StaffingRequest/StaffingRequestSubmitButton";
import {toast} from "react-toastify";
import {createStaffingRequest} from "@/actions/staffingRequest";
import {useRouter} from "next/navigation";
import {checkCaptcha} from "@/lib/captcha";

export default function StaffingRequestForm({user}: { user: User, }) {

    const router = useRouter();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const handleSubmit = async (formData: FormData) => {

        const recaptchaToken = await executeRecaptcha?.('submit_feedback');
        await checkCaptcha(recaptchaToken);

        const {errors} = await createStaffingRequest(formData);
        if (errors) {
            toast(errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }
        router.push(`/staffing/success`);
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="userId" value={user.id}/>
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
    );
}