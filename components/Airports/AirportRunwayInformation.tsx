import React from 'react';
import {Airport} from "@/actions/airports";
import {Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";

export default function AirportRunwayInformation({airport}: { airport: Airport, },) {
    return (
        <Stack direction="column" spacing={2}>
            <Typography variant="h6" textAlign="center">{airport.icao} Runways</Typography>
            {airport.runways.map(runway => (
                <Card key={runway.id}>
                    <CardContent>
                        <Typography variant="body1" fontWeight={700} textAlign="center">Runway {runway.id}</Typography>
                        <Table size="small" sx={{mt: 1,}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Route</TableCell>
                                    <TableCell>Expected Procedure</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {runway.procedures.map((procedure, idx) => (
                                    <TableRow key={runway.id + "-" + idx}>
                                        <TableCell>{procedure.route}</TableCell>
                                        <TableCell>{procedure.text}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}