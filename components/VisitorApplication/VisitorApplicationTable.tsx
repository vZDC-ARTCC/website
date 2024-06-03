import React from 'react';
import prisma from "@/lib/db";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {VisitorApplicationStatus} from "@prisma/client";
import Link from "next/link";
import {Grading, Info} from "@mui/icons-material";

export default async function VisitorApplicationTable({status}: { status: VisitorApplicationStatus, }) {

    const applications = await prisma.visitorApplication.findMany({
        where: {
            status,
        },
        orderBy: {
            submittedAt: status === "PENDING" ? 'asc' : 'desc',
        },
        include: {
            user: true,
        },
    });

    if (applications.length == 0) {
        return <Typography sx={{mt: 1,}}>No {status} applications found</Typography>;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>CID</TableCell>
                        <TableCell>Home Facility</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map(application => (
                        <TableRow key={application.id}>
                            <TableCell>{application.submittedAt.toDateString()}</TableCell>
                            <TableCell>{application.user.fullName}</TableCell>
                            <TableCell>{application.user.email}</TableCell>
                            <TableCell>{application.user.cid}</TableCell>
                            <TableCell>{application.homeFacility}</TableCell>
                            <TableCell>
                                <Tooltip title="View Application">
                                    <Link href={`/admin/visitor-applications/${application.id}`} passHref>
                                        <IconButton>
                                            {application.status === "PENDING" ? <Grading/> : <Info/>}
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