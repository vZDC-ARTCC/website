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
import IncidentTabs from "@/components/Incident/IncidentTabs";
import prisma from "@/lib/db";
import {Grading, Info} from "@mui/icons-material";
import Link from "next/link";

export default async function Page({searchParams}: { searchParams: { closed?: string, } }) {

    const incidents = await prisma.incidentReport.findMany({
        where: {
            closed: searchParams.closed === 'yes',
        },
        include: {
            reporter: true,
            reportee: true,
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Incident Reports</Typography>
                <IncidentTabs/>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reporter</TableCell>
                                <TableCell>Reportee</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incidents.map((incident) => (
                                <TableRow key={incident.id}>
                                    {incident.closed && <TableCell>REDACTED</TableCell>}
                                    {!incident.closed &&
                                        <TableCell>{incident.reporter.firstName} {incident.reporter.lastName}</TableCell>}
                                    <TableCell>{incident.reportee.firstName} {incident.reportee.lastName}</TableCell>
                                    <TableCell>{incident.timestamp.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View Incident">
                                            <Link href={`/admin/incidents/${incident.id}`} passHref>
                                                <IconButton>
                                                    {incident.closed ? <Info/> : <Grading/>}
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
    );
}