import React from 'react';
import prisma from "@/lib/db";
import {Box, Card, CardContent, Grid2, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";

export default async function Page() {

    const inUseOperatingInitials = await prisma.user.findMany({
        where: {
            operatingInitials: {
                not: null,
            },
        },
        select: {
            operatingInitials: true,
            cid: true,
            firstName: true,
            lastName: true,
            controllerStatus: true,
        },
    });

    const allPossibleOperatingInitials = Array.from({length: 26 * 26}, (_, i) => {
        const first = String.fromCharCode(65 + Math.floor(i / 26));
        const second = String.fromCharCode(65 + i % 26);
        return first + second;
    });

    return (
        (<Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Operating Initials Matrix</Typography>
                    <Box sx={{mt: 1, border: 2, borderRadius: 2, color: 'red',}}>
                        <Typography textAlign="center" variant="body2">In Use - HOME (hover/click to inspect
                            controller)</Typography>
                    </Box>
                    <Box sx={{mt: 1, border: 2, borderRadius: 2, color: 'green',}}>
                        <Typography textAlign="center" variant="body2">In Use - VISITOR (hover/click to inspect
                            controller)</Typography>
                    </Box>
                    <Box sx={{mt: 1, border: 2, borderRadius: 2,}}>
                        <Typography textAlign="center" variant="body2">Vacant</Typography>
                    </Box>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Grid2 container columns={26} spacing={1}>
                        {allPossibleOperatingInitials.map((initials) => {
                            const inUse = inUseOperatingInitials.find((oi) => oi.operatingInitials === initials);
                            return inUse ? (
                                <Grid2
                                    key={initials}
                                    size={{
                                        xs: 4,
                                        sm: 3,
                                        md: 2,
                                        lg: 1
                                    }}>
                                    <Tooltip title={`${inUse.firstName} ${inUse.lastName} - ${inUse.cid}`}>
                                        <Link href={`/admin/controller/${inUse.cid}`} target="_blank"
                                              style={{textDecoration: 'none',}}>
                                            <Box sx={{
                                                border: 2,
                                                borderRadius: 2,
                                                color: inUse.controllerStatus === "HOME" ? 'red' : 'green',
                                            }}>
                                                <Typography textAlign="center" variant="body2">{initials}</Typography>
                                            </Box>
                                        </Link>
                                    </Tooltip>
                                </Grid2>
                            ) : (
                                <Grid2
                                    key={initials}
                                    size={{
                                        xs: 4,
                                        sm: 3,
                                        md: 2,
                                        xl: 1
                                    }}>
                                    <Box sx={{border: 2, borderRadius: 2,}}>
                                        <Typography textAlign="center" variant="body2">{initials}</Typography>
                                    </Box>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                </CardContent>
            </Card>
        </Stack>)
    );

}