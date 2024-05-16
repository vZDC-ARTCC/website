import React from 'react';
import prisma from "@/lib/db";
import {User} from "next-auth";
import {
    Box, Card, CardContent,
    Chip, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {getRating, getSubtitle} from "@/lib/vatsim";
import {getIconForCertificationOption} from "@/lib/certification";
import {getDaysLeft} from "@/lib/date";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY || 'ZDC';
const DEV_MODE = process.env.DEV_MODE === 'true';

export default async function RosterTable({membership, search}: {
    membership: 'home' | 'visit' | 'both',
    search?: string,
}) {
    const res = await fetch(`https://api.vatusa.net/v2/facility/${VATUSA_FACILITY}/roster/${membership}`, {
        next: {
            revalidate: 3600,
        }
    });
    const data: {
        cid: number,
        fname: string,
        lname: string,
        rating: number,
        facility: string,
        membership: 'home' | 'visit',
        roles: {
            facility: string,
            role: string,
        }[],
    }[] = (await res.json()).data;


    const users = await prisma.user.findMany({
        include: {
            certifications: {
                include: {
                    certificationType: true,
                },
            },
            soloCertifications: {
                include: {
                    certificationType: true,
                },
            },
        },
        where: {
            controllerStatus: {
                not: 'NONE',
            },
            OR: [
                {
                    fullName: {
                        contains: search || '',
                        mode: 'insensitive',
                    },
                },
                {
                    preferredName: {
                        contains: search || '',
                        mode: 'insensitive',
                    },
                },
                {
                    cid: {
                        contains: search || '',
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            fullName: 'asc',
        },
    });

    let controllers: {
        vatusa: {
            cid: number,
            fname: string,
            lname: string,
            rating: number,
            facility: string,
            membership: 'home' | 'visit',
            roles: {
                facility: string,
                role: string,
            }[],
        },
        user?: User | any,
    }[] =
        data.map((vatusaUser) => ({
            vatusa: vatusaUser,
            user: users.find((user) => user.cid === vatusaUser.cid + ''),
        }))
            .sort((a, b) => {
                if (a.user && b.user) {
                    return (a.user.lastName || '').localeCompare((b.user.lastName || ''));
                } else if (a.user) {
                    return -1;
                } else if (b.user) {
                    return 1;
                } else {
                    return a.vatusa.lname.localeCompare(b.vatusa.lname);
                }
            }).filter((controller) => {
            // filter by the search query here
            if (search !== undefined && search.length > 0) {
                if (controller.user) {
                    return (controller.user.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
                        controller.user.cid.toLowerCase().includes(search.toLowerCase()) ||
                        (controller.user.preferredName || '').toLowerCase().includes(search.toLowerCase());
                } else {
                    return controller.vatusa.fname.toLowerCase().includes(search.toLowerCase()) ||
                        controller.vatusa.lname.toLowerCase().includes(search.toLowerCase()) ||
                        (controller.vatusa.cid + '').toLowerCase().includes(search.toLowerCase());
                }
            }
            return true;
        });


    const certificationTypes = await prisma.certificationType.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Card elevation={0}>
            <CardContent>
                <TableContainer sx={{maxHeight: 600,}}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Controller</TableCell>
                                {certificationTypes.map((certificationType) => (
                                    <TableCell key={certificationType.id}>{certificationType.name}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {controllers.length + users.length === 0 &&
                                <Typography>No results found for {search}</Typography>}
                            {DEV_MODE && users.map((user) => (
                                <TableRow key={user.cid}>
                                    <TableCell>
                                        <Typography
                                            variant="h6">{user.preferredName || `${user.firstName} ${user.lastName}`}
                                            <Chip label="DEV MODE"/></Typography>
                                        <Typography
                                            variant="body2">{user.preferredName && `${user.firstName} ${user.lastName}`}</Typography>
                                        <Typography variant="body1">{getRating(user.rating)} • {user.cid}</Typography>
                                        <Typography variant="subtitle2">{getSubtitle(user as User, true)}</Typography>
                                    </TableCell>
                                    {certificationTypes.map((certificationType) => (
                                        <TableCell key={certificationType.id}>
                                            {getIconForCertificationOption(user.certifications.find((certification: any) => certification.certificationType.id === certificationType.id)?.certificationOption || "NONE")}
                                            {user.soloCertifications.filter((soloCertification: any) => soloCertification.certificationType.id === certificationType.id).map((soloCertification: any) => (
                                                <Tooltip key={soloCertification.id} title="Solo Certified">
                                                    <Box>
                                                        <Typography>{soloCertification.position}*</Typography>
                                                        <Typography
                                                            variant="subtitle2">{getDaysLeft(soloCertification.expires)}</Typography>
                                                    </Box>
                                                </Tooltip>
                                            ))}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {controllers.map((user) => {
                                if (user.user) {
                                    return (
                                        <TableRow key={user.user.cid}>
                                            <TableCell>
                                                <Typography
                                                    variant="h6">{user.user.preferredName || `${user.user.firstName} ${user.user.lastName}`}</Typography>
                                                <Typography
                                                    variant="body1">{getRating(user.user.rating)} • {user.user.cid}</Typography>
                                                <Typography
                                                    variant="subtitle2">{getSubtitle(user.user as User, true)}</Typography>
                                            </TableCell>
                                            {certificationTypes.map((certificationType) => (
                                                <TableCell key={certificationType.id}>
                                                    {getIconForCertificationOption(user.user.certifications.find((certification: any) => certification.certificationType.id === certificationType.id)?.certificationOption || "NONE")}
                                                    {user.user.soloCertifications.filter((soloCertification: any) => soloCertification.certificationType.id === certificationType.id).map((soloCertification: any) => (
                                                        <Tooltip key={soloCertification.id} title="Solo Certified">
                                                            <Box>
                                                                <Typography>{soloCertification.position}*</Typography>
                                                                <Typography
                                                                    variant="subtitle2">{getDaysLeft(soloCertification.expires)}</Typography>
                                                            </Box>
                                                        </Tooltip>
                                                    ))}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                } else {
                                    return (
                                        <TableRow key={user.vatusa.cid}>
                                            <TableCell>
                                                <Typography
                                                    variant="h6">{user.vatusa.fname} {user.vatusa.lname}</Typography>
                                                <Typography
                                                    variant="body1">{getRating(user.vatusa.rating)} • {user.vatusa.cid}</Typography>
                                                <Typography
                                                    variant="subtitle2">{user.vatusa.membership === 'home' ? 'Home Controller' : `Visiting Controller (${user.vatusa.facility})`}</Typography>
                                            </TableCell>
                                            {certificationTypes.map((certificationType) => (
                                                <TableCell key={certificationType.id}>
                                                    {getIconForCertificationOption("NONE")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                }

                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>

    );
}