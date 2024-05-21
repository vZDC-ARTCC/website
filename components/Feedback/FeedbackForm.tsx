"use client";
import React from 'react';
import {User} from "next-auth";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Rating,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {z} from "zod";
import {toast} from "react-toastify";
import {submitFeedback} from "@/actions/feedback";
import {useRouter} from "next/navigation";
import {Feedback} from "@prisma/client";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {validateCaptcha} from "@/actions/captcha";
import FeedbackFormSubmitButton from "@/components/Feedback/FeedbackFormSubmitButton";

export default function FeedbackForm({controllers, user}: { controllers: User[], user: User }) {

    const router = useRouter();
    const {executeRecaptcha,} = useGoogleReCaptcha();
    const handleSubmit = async (formData: FormData) => {
        const feedbackZ = z.object({
            pilotId: z.string().trim().min(1, "Cid is required"),
            pilotCallsign: z.string().trim().min(1, "Callsign is required"),
            controllerId: z.string().trim().min(1, "Controller is required"),
            controllerPosition: z.string().min(1, "Position is required"),
            rating: z.number(),
            comments: z.string().trim(),
        });

        const result = feedbackZ.safeParse({
            pilotId: user.id,
            pilotCallsign: formData.get('pilotCallsign') as string,
            controllerId: formData.get('controllerId') as string,
            controllerPosition: formData.get('controllerPosition') as string,
            rating: parseInt(formData.get('rating') as string),
            comments: formData.get('comments') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        const recaptchaToken = await executeRecaptcha?.('submit_feedback');
        if (!recaptchaToken) {
            toast('Recaptcha validation failed', {type: 'error'});
            return;
        }
        const captchaResult = await validateCaptcha(recaptchaToken);

        if (!captchaResult.success) {
            toast('Recaptcha validation failed', {type: 'error'});
            return;
        }

        if (captchaResult.score < 0.5) {
            toast('Recaptcha validation failed', {type: 'error'});
            return;
        }

        await submitFeedback(result.data as unknown as Feedback);
        router.push('/feedback/success');
    }

    return (
        <Box sx={{mt: 2,}}>
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
                        <TextField fullWidth variant="filled" name="pilotCallsign" label="Your Callsign*"/>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <FormControl fullWidth>
                            <InputLabel id="controller-select-label">Controller*</InputLabel>
                            <Select
                                labelId="controller-select-label"
                                id="controller-select"
                                label="Controller*"
                                name="controllerId"
                                defaultValue={''}
                            >
                                {controllers.map((controller) => (
                                    <MenuItem key={controller.id}
                                              value={controller.id}>{controller.firstName} {controller.lastName} ({controller.cid})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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