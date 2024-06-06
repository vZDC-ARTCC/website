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
    Tooltip,
    Typography
} from "@mui/material";
import LoaTabs from "@/components/LOA/LOATabs";
import prisma from "@/lib/db";
import {LOAStatus} from "@prisma/client";
import Link from "next/link";
import {Grading, Info} from "@mui/icons-material";
import LoaDeleteButton from "@/components/LOA/LoaDeleteButton";

export default async function Page({searchParams}: { searchParams: { status?: string, }, }) {

    const status = searchParams.status || "PENDING";

    const loas = await prisma.lOA.findMany({
        where: {
            status: status as LOAStatus,
        },
        include: {
            user: true,
        },
        orderBy: {
            start: "desc",
        },
    })

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Leave of Absences</Typography>
                <LoaTabs/>
                {loas.length === 0 && <Typography>No {status} LOAs found.</Typography>}
                {loas.length > 0 && <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loas.map((loa) => (
                                <TableRow key={loa.id}>
                                    <TableCell>{loa.user.firstName} {loa.user.lastName}</TableCell>
                                    <TableCell>{loa.start.toDateString()}</TableCell>
                                    <TableCell>{loa.end.toDateString()}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View LOA">
                                            <Link href={`/admin/loas/${loa.id}`} passHref>
                                                <IconButton>
                                                    {loa.status === "PENDING" ? <Grading/> : <Info/>}
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        {loa.status !== "INACTIVE" && <LoaDeleteButton loa={loa} icon/>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </CardContent>
        </Card>
    );

}