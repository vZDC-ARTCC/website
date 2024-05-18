import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

export default function StatisticsTableNew({heading, logs,}: {
    heading: string, logs: {
        title: string,
        deliveryHours: number,
        groundHours: number,
        towerHours: number,
        approachHours: number,
        centerHours: number,
    }[]
}) {

    if (logs.length === 0) {
        return <Typography sx={{my: 1,}}>No data for this time period</Typography>
    }

    return (
        <TableContainer sx={{maxHeight: 600,}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{heading}</TableCell>
                        <TableCell>Delivery</TableCell>
                        <TableCell>Ground</TableCell>
                        <TableCell>Tower</TableCell>
                        <TableCell>TRACON</TableCell>
                        <TableCell>Center</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map(log => (
                        <TableRow key={log.title}>
                            <TableCell>{log.title}</TableCell>
                            <TableCell>{log.deliveryHours.toPrecision(3)}</TableCell>
                            <TableCell>{log.groundHours.toPrecision(3)}</TableCell>
                            <TableCell>{log.towerHours.toPrecision(3)}</TableCell>
                            <TableCell>{log.approachHours.toPrecision(3)}</TableCell>
                            <TableCell>{log.centerHours.toPrecision(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}