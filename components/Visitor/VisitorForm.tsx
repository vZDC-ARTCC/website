'use client';
import React from 'react';
import {Button, Checkbox, FormControlLabel, Grid, Stack, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {toast} from "react-toastify";
import {addVisitingApplication} from "@/actions/visitor";
import {useRouter} from "next/navigation";
import {User} from "next-auth";
import {getRating} from "@/lib/vatsim";
import VisitorFormSubmitButton from "@/components/Visitor/VisitorFormSubmitButton";

export default function VisitorForm({user}: { user: User, }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const visitorZ = z.object({
            homeFacility: z.string().trim().min(1, "Home ARTCC is required"),
            whyVisit: z.string().trim().min(1, "Reason for visiting is required"),
            meetUsaReqs: z.boolean().refine((val) => val, "You must meet the VATUSA visiting requirements"),
            meetZdcReqs: z.boolean().refine((val) => val, "You must agree to our visiting policy"),
            goodStanding: z.boolean().refine((val) => val, "You must be in good standing with your home ARTCC"),
        });

        const result = visitorZ.safeParse({
            homeFacility: formData.get("homeFacility"),
            whyVisit: formData.get("whyVisit"),
            meetUsaReqs: formData.get("meetUsaReqs") === 'on',
            meetZdcReqs: formData.get("meetZdcReqs") === 'on',
            goodStanding: formData.get("goodStanding") === 'on',
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        try {
            await addVisitingApplication(result.data as any, user);
            router.push('/visitor/success');
        } catch (e: any) {
            toast(e.message, {type: "error"});
        }
    }

    return (
        <form action={handleSubmit}>
            <Grid container spacing={2} rowSpacing={4} columns={2}>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="name" label="Full Name" defaultValue={user.fullName}
                               disabled/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="cid" label="VATSIM CID" defaultValue={user.cid}
                               disabled/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="rating" label="Rating"
                               defaultValue={getRating(user.rating)} disabled/>
                </Grid>
                <Grid item xs={2} lg={1}>
                    <TextField variant="filled" fullWidth name="email" label="Email" defaultValue={user.email}
                               disabled/>
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
                        <FormControlLabel control={<Checkbox name="goodStanding"/>}
                                          label="you are in good standing with your home ARTCC"/>
                        <VisitorFormSubmitButton />
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
}