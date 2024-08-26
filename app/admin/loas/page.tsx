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
import LoaTable from "@/components/LOA/LOATable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Leave of Absences</Typography>
                <LoaTable/>
            </CardContent>
        </Card>
    );

}