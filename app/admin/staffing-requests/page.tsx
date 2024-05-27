import React from 'react';
import {
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import Link from "next/link";
import {Visibility} from "@mui/icons-material";

export default async function Page() {

    const staffingRequests = await prisma.staffingRequest.findMany({
        include: {
            user: true,
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Staffing Requests</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>CID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Proposed Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {staffingRequests.map((staffingRequest) => (
                                <TableRow key={staffingRequest.id}>
                                    <TableCell>{staffingRequest.user.firstName} {staffingRequest.user.lastName}</TableCell>
                                    <TableCell>{staffingRequest.user.cid}</TableCell>
                                    <TableCell>{staffingRequest.user.email}</TableCell>
                                    <TableCell>{staffingRequest.name}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/staffing-requests/${staffingRequest.id}`}>
                                            <IconButton>
                                                <Visibility/>
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}