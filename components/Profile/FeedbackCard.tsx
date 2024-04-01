import React from 'react';
import {
    Button,
    Card,
    CardContent, IconButton, Rating, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {User} from "next-auth";
import {getTimeAgo} from "@/lib/date";
import Link from "next/link";
import {KeyboardArrowRight, Visibility} from "@mui/icons-material";

export default async function FeedbackCard({user}: { user: User, }) {

    const recentFeedback = await prisma.feedback.findMany({
        take: 5,
        where: {
            controller: {
                id: user.id,
            },
            status: "RELEASED",
        },
        orderBy: {
            decidedAt: 'desc',
        },
        include: {
            controller: true,
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{mb: 1,}}>Feedback</Typography>
                {recentFeedback.length == 0 && <Typography>No feedback found</Typography>}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Released</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentFeedback.map(feedback => (
                                <TableRow key={feedback.id}>
                                    <TableCell>{getTimeAgo(feedback.decidedAt || new Date())}</TableCell>
                                    <TableCell>{feedback.controllerPosition}</TableCell>
                                    <TableCell><Rating readOnly value={feedback.rating}/></TableCell>
                                    <TableCell>
                                        <Tooltip title="View Feedback">
                                            <Link href={`/profile/feedback/${feedback.id}`} style={{color: 'inherit',}}>
                                                <IconButton>
                                                    <Visibility/>
                                                </IconButton>
                                            </Link>
                                        </Tooltip>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack direction="row" justifyContent="flex-end" sx={{mt: 1,}}>
                    <Link href="/profile/feedback" style={{color: 'inherit', textDecoration: 'none',}}>
                        <Button color="inherit" endIcon={<KeyboardArrowRight/>}>View all Feedback</Button>
                    </Link>
                </Stack>
            </CardContent>
        </Card>
    );
}