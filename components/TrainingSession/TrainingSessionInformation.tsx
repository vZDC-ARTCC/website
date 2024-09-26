import React from 'react';
import {notFound} from "next/navigation";
import prisma from "@/lib/db";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import LessonRubricGrid from "@/components/Lesson/LessonRubricGrid";
import {ExpandMore} from "@mui/icons-material";
import Markdown from "react-markdown";
import {formatZuluDate, getDuration} from "@/lib/date";
import TrainingMarkdownSwitch from './TrainingMarkdownSwitch';

export default async function TrainingSessionInformation({id, trainerView}: { id: string, trainerView?: boolean }) {

    const trainingSession = await prisma.trainingSession.findUnique({
        where: {
            id
        },
        include: {
            student: true,
            instructor: true,
            tickets: {
                include: {
                    lesson: true,
                    mistakes: true,
                    scores: true,
                }
            },
        }
    });

    if (!trainingSession) {
        notFound();
    }

    return (
        <Stack direction="column" spacing={2}>
            <Box>
                <Typography variant="h5">Training
                    Session{trainerView ? ` - ${trainingSession.student.firstName} ${trainingSession.student.lastName} (${trainingSession.student.cid})` : ''}</Typography>
                <Typography
                    variant="subtitle1">Trainer: {trainingSession.instructor.firstName} {trainingSession.instructor.lastName} ({trainingSession.instructor.cid})</Typography>
                <Typography
                    variant="subtitle2">{formatZuluDate(trainingSession.start)} - {formatZuluDate(trainingSession.end).substring(9)}</Typography>
                <Typography
                    variant="subtitle2">Duration: {getDuration(trainingSession.start, trainingSession.end)}</Typography>
            </Box>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>Lessons</Typography>
                    {trainingSession.tickets.map((ticket) => (
                        <Accordion key={ticket.id}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>{ticket.lesson.identifier} - {ticket.lesson.name}</Typography>
                                    <Chip label={ticket.passed ? 'PASS' : 'FAIL'}
                                          color={ticket.passed ? 'success' : 'error'}/>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack direction="column" spacing={2}>
                                            <Box>
                                                <Typography variant="h6">Scoring</Typography>
                                                <Typography variant="subtitle2">{ticket.lesson.position}</Typography>
                                                <LessonRubricGrid lessonId={ticket.lesson.id} scores={ticket.scores}/>
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{mb: 1,}}>Mistakes</Typography>
                                                {ticket.mistakes.length === 0 &&
                                                    <Typography>No common mistakes observed.</Typography>}
                                                {ticket.mistakes.map((mistake) => (
                                                    <Accordion key={mistake.id}>
                                                        <AccordionSummary expandIcon={<ExpandMore/>}>
                                                            <Typography>{mistake.facility ? `${mistake.facility} - ` : ''}{mistake.name}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Markdown>{mistake.description}</Markdown>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CardContent>
            </Card>
            <TrainingMarkdownSwitch trainingSession={trainingSession} trainerView={trainerView}/>
        </Stack>
    );
}