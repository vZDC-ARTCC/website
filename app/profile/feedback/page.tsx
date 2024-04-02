import React from 'react';
import prisma from "@/lib/db";
import {authOptions} from "@/auth/auth";
import {getServerSession} from "next-auth";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import Link from "next/link";
import {KeyboardArrowLeft, Visibility} from "@mui/icons-material";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const feedback = await prisma.feedback.findMany({
        where: {
            controller: {
                id: session?.user.id
            },
            status: "RELEASED",
        },
        include: {
            controller: true,
        },
        orderBy: {
            submittedAt: 'desc'
        },
    });

    return (
        <Box>
            <Link href="/profile/overview" style={{color: 'inherit',}}>
                <Button color="inherit" startIcon={<KeyboardArrowLeft/>} sx={{mb: 2,}}>Profile</Button>
            </Link>
            <Card>
                <CardContent>
                    <Typography variant="h5">Your Feedback</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Submitted</TableCell>
                                    <TableCell>Position Staffed</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedback.map(feedback => (
                                    <TableRow key={feedback.id}>
                                        <TableCell>{feedback.submittedAt.toDateString()}</TableCell>
                                        <TableCell>{feedback.controllerPosition}</TableCell>
                                        <TableCell><Rating readOnly value={feedback.rating}/></TableCell>
                                        <TableCell>
                                            <Tooltip title="View Feedback">
                                                <Link href={`/profile/feedback/${feedback.id}`}
                                                      style={{color: 'inherit',}}>
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
                </CardContent>
            </Card>
        </Box>

    );
}