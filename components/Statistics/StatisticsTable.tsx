'use client';
import React from 'react';
import {ControllerLogMonth} from "@prisma/client";
import {
    Box,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useRouter, useSearchParams} from "next/navigation";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

function StatisticsTable({basePath, logs, year}: { basePath: string, logs: ControllerLogMonth[], year: number }) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const setYear = (year: number) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('year', year.toString());
        router.replace(basePath + `?${newSearchParams.toString()}`);
    }

    function getMonth(month: number) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    return (
        <Box sx={{mt: 1,}}>
            <Stack direction="row" justifyContent="space-between">
                <IconButton onClick={() => setYear(year - 1)} size="large" edge="start">
                    <ArrowBack fontSize="large"/>
                </IconButton>
                <Typography variant="h4">{year}</Typography>
                <IconButton onClick={() => setYear(year + 1)} size="large" edge="end">
                    <ArrowForward fontSize="large"/>
                </IconButton>
            </Stack>
            {logs.length === 0 && <Typography sx={{my: 2,}}>No data available for {year}</Typography>}
            {logs.length > 0 && <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Delivery (hrs)</TableCell>
                            <TableCell>Ground (hrs)</TableCell>
                            <TableCell>Tower (hrs)</TableCell>
                            <TableCell>TRACON (hrs)</TableCell>
                            <TableCell>Center (hrs)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{getMonth(log.month)}</TableCell>
                                <TableCell>{log.deliveryHours.toPrecision(2)}</TableCell>
                                <TableCell>{log.groundHours.toPrecision(2)}</TableCell>
                                <TableCell>{log.towerHours.toPrecision(2)}</TableCell>
                                <TableCell>{log.approachHours.toPrecision(2)}</TableCell>
                                <TableCell>{log.centerHours.toPrecision(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Box>

    );
}

export default StatisticsTable;