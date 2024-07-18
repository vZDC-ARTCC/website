import React from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Chip,
    ListItemIcon,
    Stack,
    Typography
} from "@mui/material";
import {AddModerator, ChangeCircle, ExpandMore} from "@mui/icons-material";
import LessonRubricGrid from "@/components/Lesson/LessonRubricGrid";
import Markdown from "react-markdown";


const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export default async function ChangeLogOverview() {

    return (
        <Stack direction="column" spacing={2}>
            <Box>
                <Typography variant="h3">vZDC Website Changelog</Typography>
                <Typography variant="subtitle1">Latest Version: </Typography>
                <Typography variant="subtitle2">Last Updated: </Typography>
            </Box>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>Versions</Typography>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>Version Id - Heading Title</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack direction="column" spacing={2}>
                                            <Box>
                                                <Typography variant="h6">Version Overview</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{mb: 1,}}>Version Details</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </AccordionDetails>
                        </Accordion>

                </CardContent>
            </Card>
        </Stack>
    );
}