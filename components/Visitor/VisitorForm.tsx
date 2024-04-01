'use client';
import React from 'react';
import {Button, Checkbox, FormControlLabel, Grid, Stack, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {toast} from "react-toastify";
import {addVisitingApplication} from "@/actions/visitor";
import {useRouter} from "next/navigation";

export default function VisitorForm() {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const visitorZ = z.object({
            firstName: z.string().trim().min(1, "First name is required"),
            lastName: z.string().trim().min(1, "Last name is required"),
            cid: z.string().trim().min(1, "VATSIM CID is required"),
            rating: z.string().trim().min(1, "Rating is required"),
            email: z.string().trim().min(1, "Email is required"),
            homeFacility: z.string().trim().min(1, "Home ARTCC is required"),
            whyVisit: z.string().trim().min(1, "Reason for visiting is required"),
            meetUsaReqs: z.boolean().refine((val) => val, "You must meet the VATUSA visiting requirements"),
            meetZdcReqs: z.boolean().refine((val) => val, "You must agree to our visiting policy"),
            nonDuplicate: z.boolean().refine((val) => val, "You must not have a pending application"),
            goodStanding: z.boolean().refine((val) => val, "You must be in good standing with your home ARTCC"),
        });

        const result = visitorZ.safeParse({
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            cid: formData.get("cid"),
            rating: formData.get("rating"),
            email: formData.get("email"),
            homeFacility: formData.get("homeFacility"),
            whyVisit: formData.get("whyVisit"),
            meetUsaReqs: formData.get("meetUsaReqs") === 'on',
            meetZdcReqs: formData.get("meetZdcReqs") === 'on',
            nonDuplicate: formData.get("nonDuplicate") === 'on',
            goodStanding: formData.get("goodStanding") === 'on',
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        try {
            await addVisitingApplication(result.data as any);
            router.push('/visitor/success');
        } catch (e: any) {
            toast(e.message, {type: "error"});
        }
    }

    return (
        <form action={handleSubmit}>
            <Grid container spacing={2} rowSpacing={4} columns={2}>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="firstName" label="First Name"/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="lastName" label="Last Name"/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="cid" label="VATSIM CID"/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="rating" label="Rating"/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="email" label="Email"/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="homeFacility" label="Home ARTCC/FIR"/>
                </Grid>
                <Grid item xs={2}>
                    <TextField variant="filled" multiline rows={4} fullWidth name="whyVisit"
                               label="Why would you like to visit the Virtual Washington ARTCC?"/>
                </Grid>
                <Grid item xs={2}>
                    <Stack direction="column" spacing={1}>
                        <Typography>Before submitting your application, you agree that:</Typography>
                        <FormControlLabel control={<Checkbox name="meetUsaReqs"/>}
                                          label="you meet the VATUSA visiting requirements"/>
                        <FormControlLabel control={<Checkbox name="meetZdcReqs"/>}
                                          label="you agree to our visiting policy"/>
                        <FormControlLabel control={<Checkbox name="nonDuplicate"/>}
                                          label="you do NOT have a visiting application that is already pending"/>
                        <FormControlLabel control={<Checkbox name="goodStanding"/>}
                                          label="you are in good standing with your home ARTCC"/>
                        <Button type="submit" variant="contained" size="large">Submit Application</Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
}