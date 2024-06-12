"use client";
import React, {useState} from 'react';
import {User} from "next-auth";
import {Autocomplete, Box, Grid, Rating, TextField, Typography} from "@mui/material";
import {toast} from "react-toastify";
import {submitFeedback} from "@/actions/feedback";
import {useRouter} from "next/navigation";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import FeedbackFormSubmitButton from "@/components/Feedback/FeedbackFormSubmitButton";
import {checkCaptcha} from "@/lib/captcha";

export default function FeedbackForm({controllers, user}: { controllers: User[], user: User }) {

    const router = useRouter();
    const {executeRecaptcha,} = useGoogleReCaptcha();
    const [controller, setController] = useState('');

    const handleSubmit = async (formData: FormData) => {

        const recaptchaToken = await executeRecaptcha?.('submit_feedback');
        await checkCaptcha(recaptchaToken);

        const {errors} = await submitFeedback(formData);
        if (errors) {
            toast(errors.map((e) => e.message).join('.  '), {type: 'error'});
            return;
        }
        router.push('/feedback/success');
    }

    return (
        <Box sx={{mt: 2,}}>
            <form action={handleSubmit}>
                <input type="hidden" name="pilotId" value={user.id}/>
                <input type="hidden" name="controllerId" value={controller}/>
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
                        <TextField fullWidth variant="filled" name="pilotCallsign" label="Your Callsign*"/>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <Autocomplete
                            fullWidth
                            options={controllers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                            value={controllers.find((u) => u.id === controller) || null}
                            onChange={(event, newValue) => {
                                setController(newValue ? newValue.id : '');
                            }}
                            renderInput={(params) => <TextField {...params} label="Controller"/>}
                        />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <TextField fullWidth variant="filled" name="controllerPosition" label="Position Staffed*"/>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography component="legend">Rating*</Typography>
                        <Rating
                            name="rating"
                            defaultValue={4}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField fullWidth multiline rows={5} variant="filled" name="comments"
                                   label="Additional Comments"/>
                    </Grid>
                    <Grid item xs={2}>
                       <FeedbackFormSubmitButton />
                    </Grid>
                </Grid>
            </form>
        </Box>

    );

}