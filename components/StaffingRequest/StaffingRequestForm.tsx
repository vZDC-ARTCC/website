'use client';
import React from 'react';
import {User} from "next-auth";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {Grid, TextField} from "@mui/material";
import StaffingRequestSubmitButton from "@/components/StaffingRequest/StaffingRequestSubmitButton";
import {z} from "zod";
import {toast} from "react-toastify";
import {createStaffingRequest} from "@/actions/staffingRequest";
import {useRouter} from "next/navigation";
import {checkCaptcha} from "@/lib/captcha";

export default function StaffingRequestForm({user}: { user: User, }) {

    const router = useRouter();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const handleSubmit = async (formData: FormData) => {
        const staffPositionZ = z.object({
            name: z.string().min(1, 'Name must be at least 1 character long'),
            description: z.string().min(1, 'Description must be at least 1 character long'),
        });

        const result = staffPositionZ.safeParse({
            name: formData.get('name') as string,
            description: formData.get('description') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        const recaptchaToken = await executeRecaptcha?.('submit_feedback');
        await checkCaptcha(recaptchaToken);

        await createStaffingRequest(user, result.data.name, result.data.description);
        router.push(`/staffing/success`);
    }

    return (
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
    );
}