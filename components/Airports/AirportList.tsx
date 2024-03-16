import React from 'react';
import {AirportGroup} from "@/actions/airports";
import {Box, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import Link from "next/link";

export default function AirportList({airportGroups}: { airportGroups: AirportGroup[] }) {
    return (
        <Stack direction="column" spacing={4}>
            {airportGroups.map((group, index) => (
                <Box key={index}>
                    <Typography variant="h6">{group.name}</Typography>
                    <Divider/>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ICAO</TableCell>
                                <TableCell>IATA</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>City</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {group.airports.map((airport) => (
                                <TableRow key={airport.icao} hover component={Link} href={`/airports/${airport.icao}`}
                                          sx={{textDecoration: 'none', cursor: 'pointer',}}>
                                    <TableCell>{airport.icao}</TableCell>
                                    <TableCell>{airport.iata}</TableCell>
                                    <TableCell>{airport.name}</TableCell>
                                    <TableCell>{airport.city}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

            ))}
        </Stack>
    );
}