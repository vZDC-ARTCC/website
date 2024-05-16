import React from 'react';
import prisma from "@/lib/db";
import {
    IconButton, Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {FeedbackStatus} from "@prisma/client";
import Link from "next/link";
import {Grading, Info} from "@mui/icons-material";

export default async function FeedbackTable({status}: { status: FeedbackStatus, }) {

    const feedback = await prisma.feedback.findMany({
        where: {
            status,
        },
        include: {
            controller: true,
            pilot: true,
        },
        orderBy: {
            submittedAt: status === "PENDING" ? 'asc' : 'desc',
        },
    });

    if (feedback.length == 0) {
        return <Typography sx={{mt: 1,}}>No {status} feedback found</Typography>;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Controller</TableCell>
                        <TableCell>Pilot Name</TableCell>
                        <TableCell>Position Staffed</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {feedback.map(feedback => (
                        <TableRow key={feedback.id}>
                            <TableCell>{feedback.submittedAt.toUTCString()}</TableCell>
                            <TableCell>{feedback.controller.firstName} {feedback.controller.lastName} ({feedback.controller.cid})</TableCell>
                            <TableCell>{feedback.pilot.fullName}</TableCell>
                            <TableCell>{feedback.controllerPosition}</TableCell>
                            <TableCell><Rating readOnly value={feedback.rating}/></TableCell>
                            <TableCell>
                                <Tooltip title="View Application">
                                    <Link href={`/admin/feedback/${feedback.id}`} passHref>
                                        <IconButton>
                                            {feedback.status === "PENDING" ? <Grading/> : <Info/>}
                                        </IconButton>
                                    </Link>
                                </Tooltip>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}