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
import IncidentTable from "@/components/Incident/IncidentTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Incident Reports</Typography>
                <IncidentTable/>
            </CardContent>
        </Card>
    );
}