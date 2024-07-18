import React from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    IconButton,
    Button
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Markdown from "react-markdown";
import prisma from "@/lib/db";
import {formatZuluDate} from "@/lib/date";
import {Edit, Add} from "@mui/icons-material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import Link from "next/link";
import ChangeLogDeleteButton from "@/components/Changelog/ChangeLogDeleteButton";


const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export default async function ChangeLogOverview() {

    const session = await getServerSession(authOptions);

    const version = await prisma.version.findMany({
        include : {
            changeDetails : true
        },
        orderBy: {
            versionNumber: 'asc',
        }
    });

    const findFirst = await prisma.version.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
    // console.log(version)
    // console.log(version[0].changeDetails)

    return (
        <Stack direction="column" spacing={2}>
            <Box>
                <Typography variant="h3">vZDC Website Changelog</Typography>
            { findFirst.length!==0 ?       
                <>      
                    <Typography variant="subtitle1">Latest Version: {findFirst[0].versionNumber}</Typography>
                    <Typography variant="subtitle2">Last Updated: {formatZuluDate(findFirst[0].createdAt)}</Typography>
                </>   
                    :
                <></>
            }
            </Box>
            {session.user.roles.includes("STAFF") ? 
                <Link href="/changelog/new">
                    <Button variant="contained" size="large" startIcon={<Add/>}>New Change Log</Button>
                </Link>
                :
                <></>
            }
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>Versions</Typography>
                    {version.map((version) => (
                        <Accordion key={version.id}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>{version.versionNumber}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card variant="outlined">
                                    <CardContent>
                                        {session.user.roles.includes("STAFF") ? 
                                            <>
                                                <Link href={`/changelog/${version.id}`} passHref>
                                                    <IconButton size="small">
                                                        <Edit/>
                                                    </IconButton>
                                                </Link>

                                               <ChangeLogDeleteButton changeLog={version}/>

                                            </>
                                        :
                                            <></>
                                        }
                                        <Stack direction="column" spacing={2}>

                                            <Box>
                                                <Markdown>{version.changeDetails[0].detail}</Markdown>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CardContent>
            </Card>
        </Stack>
    );
}