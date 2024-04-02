import React from 'react';
import {
    Card,
    CardContent,
    Divider,
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
import prisma from "@/lib/db";
import {Visibility} from "@mui/icons-material";
import Link from "next/link";

export default async function Page() {

    const data = await prisma.traconGroup.findMany({
        include: {
            airports: {
                include: {
                    runways: {
                        include: {
                            runwayInstructions: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <>
            {data.map((group) => (
                <Card key={group.id}>
                    <CardContent>
                        <Typography variant="h6" sx={{mb: 1,}}>{group.name}</Typography>
                        <Divider/>
                        <TableContainer sx={{maxHeight: 400,}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ICAO</TableCell>
                                        <TableCell>IATA</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {group.airports.map((airport) => (
                                        <TableRow key={airport.icao}>
                                            <TableCell>{airport.icao}</TableCell>
                                            <TableCell>{airport.iata}</TableCell>
                                            <TableCell>{airport.name}</TableCell>
                                            <TableCell>{airport.city}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Airport Information">
                                                    <Link href={`/airports/${airport.icao}`}
                                                          style={{color: 'inherit',}}>
                                                        <IconButton>
                                                            <Visibility/>
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
            ))}
        </>
    );
}