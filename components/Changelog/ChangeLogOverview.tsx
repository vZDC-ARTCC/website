import React from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Stack,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Markdown from "react-markdown";
import prisma from "@/lib/db";
import {formatZuluDate} from "@/lib/date";


const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export default async function ChangeLogOverview() {

    const version = await prisma.version.findMany({
        include : {
            changeDetails : true
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
                {findFirst.map((item)=>(
                <>
                    <Typography variant="subtitle1">Latest Version: {item.versionNumber}</Typography>
                    <Typography variant="subtitle2">Last Updated: {formatZuluDate(item.createdAt)}</Typography>
                </>
                ))}
            </Box>
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