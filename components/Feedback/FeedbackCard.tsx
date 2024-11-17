import React from 'react';
import {Feedback, FeedbackStatus} from "@prisma/client";
import {Card, CardContent, Chip, Grid2, Rating, Stack, Typography} from "@mui/material";
import FeedbackDecisionForm from "@/components/Feedback/FeedbackDecisionForm";

export default function FeedbackCard({feedback, admin}: { feedback: Feedback | any, admin?: boolean, }) {
    const getStatusColor = (status: FeedbackStatus) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'RELEASED':
                return 'success';
            case 'STASHED':
                return 'error';
            default:
                return 'default';
        }
    }

    return (
        (<Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h5">Controller Feedback</Typography>
                    {admin && <Chip label={feedback.status} color={getStatusColor(feedback.status)}/>}
                </Stack>
                <Typography
                    variant="subtitle2">{feedback.controller.firstName} {feedback.controller.lastName} ({feedback.controller.cid})</Typography>
                <Typography variant="subtitle2">{feedback.submittedAt.toUTCString()}</Typography>
                <Grid2 container spacing={2} columns={2} sx={{mt: 2, mb: 4,}}>
                    {admin && (
                        <>
                            <Grid2
                                size={{
                                    xs: 2,
                                    md: 1
                                }}>
                                <Typography variant="subtitle2">Pilot Name</Typography>
                                <Typography
                                    variant="body2">{feedback.pilot.firstName} {feedback.pilot.lastName}</Typography>
                            </Grid2>
                            <Grid2
                                size={{
                                    xs: 2,
                                    md: 1
                                }}>
                                <Typography variant="subtitle2">Pilot CID</Typography>
                                <Typography variant="body2">{feedback.pilot.cid}</Typography>
                            </Grid2>
                            <Grid2
                                size={{
                                    xs: 2,
                                    md: 1
                                }}>
                                <Typography variant="subtitle2">Pilot Email</Typography>
                                <Typography variant="body2">{feedback.pilot.email}</Typography>
                            </Grid2>
                        </>
                    )}
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Pilot Callsign</Typography>
                        <Typography variant="body2">{feedback.pilotCallsign}</Typography>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Position Staffed</Typography>
                        <Typography variant="body2">{feedback.controllerPosition}</Typography>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Rating</Typography>
                        <Rating readOnly value={feedback.rating}/>
                    </Grid2>
                    <Grid2 size={2}>
                        <Typography variant="subtitle2">Additional Comments</Typography>
                        <Typography variant="body2">{feedback.comments}</Typography>
                    </Grid2>
                    {feedback.status !== "PENDING" && <Grid2 size={2}>
                        <Typography variant="subtitle2">Staff Comments</Typography>
                        <Typography variant="body2">{feedback.staffComments || 'N/A'}</Typography>
                    </Grid2>}
                </Grid2>
                {admin && <FeedbackDecisionForm feedback={feedback}/>}
            </CardContent>
        </Card>)
    );
}