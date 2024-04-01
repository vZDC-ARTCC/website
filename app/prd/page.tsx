import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {getPrdRoutes} from "@/actions/prd";
import PrdForm from "@/components/Prd/PrdForm";
import {PreferredRoute} from "@/types";

export default async function Page({searchParams}: { searchParams: { origin?: string, destination?: string } }) {

    const {origin, destination} = searchParams;

    let routes: PreferredRoute[] | undefined = undefined;

    if (origin || destination) {
        routes = await getPrdRoutes(origin, destination);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Preferred Routes</Typography>
                <PrdForm/>
                {routes && routes.length === 0 && <Typography>No PRD routes found</Typography>}
                {routes && routes.length > 0 &&
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Origin</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Route</TableCell>
                                    <TableCell>Hours (1)</TableCell>
                                    <TableCell>Hours (2)</TableCell>
                                    <TableCell>Hours (3)</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Area</TableCell>
                                    <TableCell>Altitude</TableCell>
                                    <TableCell>Aircraft</TableCell>
                                    <TableCell>Flow</TableCell>
                                    <TableCell>Sequence</TableCell>
                                    <TableCell>Departure ARTCC</TableCell>
                                    <TableCell>Arrival ARTCC</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routes && routes.map((route, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{route.origin}</TableCell>
                                        <TableCell>{route.destination}</TableCell>
                                        <TableCell>{route.route}</TableCell>
                                        <TableCell>{route.hours1}</TableCell>
                                        <TableCell>{route.hours2}</TableCell>
                                        <TableCell>{route.hours3}</TableCell>
                                        <TableCell>{route.type}</TableCell>
                                        <TableCell>{route.area}</TableCell>
                                        <TableCell>{route.altitude}</TableCell>
                                        <TableCell>{route.aircraft}</TableCell>
                                        <TableCell>{route.flow}</TableCell>
                                        <TableCell>{route.seq}</TableCell>
                                        <TableCell>{route.d_artcc}</TableCell>
                                        <TableCell>{route.a_artcc}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </CardContent>

        </Card>

    );
}