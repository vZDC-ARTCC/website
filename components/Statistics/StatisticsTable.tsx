import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

export default function StatisticsTable({heading, logs,}: {
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

    logs.sort((a,b)=> parseFloat((b.deliveryHours + b.groundHours + b.towerHours + b.approachHours + b.centerHours).toPrecision(3)) - parseFloat((a.deliveryHours + a.groundHours + a.towerHours + a.approachHours + a.centerHours).toPrecision(3)))

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
                        <TableCell>Total</TableCell>
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
                            <TableCell
                                sx={{border: 1,}}>{(log.deliveryHours + log.groundHours + log.towerHours + log.approachHours + log.centerHours).toPrecision(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}