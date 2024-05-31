'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {CommonMistake, Lesson, RubricCriteraScore, TrainingSession} from "@prisma/client";
import {getAllData, getTicketsForSession} from "@/actions/trainingSessionFormHelper";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {useSearchParams} from "next/navigation";
import {User} from "next-auth";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TrainingTicketForm from "@/components/TrainingSession/TrainingTicketForm";
import {Delete, ExpandMore} from "@mui/icons-material";
import {toast} from "react-toastify";
import MarkdownEditor from "@uiw/react-markdown-editor";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function TrainingSessionForm({trainingSession,}: { trainingSession?: TrainingSession, }) {

    const theme = useTheme();
    const searchParams = useSearchParams();
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [allCommonMistakes, setAllCommonMistakes] = useState<CommonMistake[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allLoading, setAllLoading] = useState<boolean>(true);
    const [student, setStudent] = useState<string>(searchParams.get('student') || '');
    const [start, setStart] = useState<Date | null>(trainingSession?.start || new Date());
    const [end, setEnd] = useState<Date | null>(trainingSession?.end || new Date());
    const [trainingTickets, setTrainingTickets] = useState<{
        passed: boolean,
        lesson: Lesson,
        mistakes: CommonMistake[],
        scores: RubricCriteraScore[],
    }[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState<string>(trainingSession?.additionalComments || '');
    const [trainerNotes, setTrainerNotes] = useState<string>(trainingSession?.trainerComments || '');

    const getInitialData = useCallback(async () => {
        setAllLoading(true);
        const {lessons, commonMistakes, users} = await getAllData();
        setAllLessons(lessons);
        setAllCommonMistakes(commonMistakes);
        setAllUsers(users as User[]);
        setAllLoading(false);
        if (trainingSession) {
            const tickets = await getTicketsForSession(trainingSession.id);
            setTrainingTickets(tickets.map((ticket) => {
                return {
                    passed: ticket.passed,
                    lesson: ticket.lesson,
                    mistakes: ticket.mistakes,
                    scores: ticket.scores,
                }
            }));
        }
    }, []);

    const handleSubmit = async () => {
        console.log(student);
        console.log(start);
        console.log(end);
        console.log(trainingTickets);
        console.log(additionalNotes);
        console.log(trainerNotes);
    }

    useEffect(() => {
        getInitialData().then();
    }, [getInitialData])

    if (allLoading) {
        return <CircularProgress/>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form action={handleSubmit}>
                <Grid container columns={2} spacing={2}>
                    <Grid item xs={2}>
                        <Autocomplete
                            options={allUsers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                            onChange={(event, newValue) => {
                                setStudent(newValue ? newValue.id : '');
                            }}
                            renderInput={(params) => <TextField {...params} label="Student"/>}
                        />
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker label="Start (Zulu)" value={dayjs(start)}
                                        onChange={(d) => setStart(d?.toDate() || null)}/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker label="End (Zulu)" value={dayjs(end)}
                                        onChange={(d) => setEnd(d?.toDate() || null)}/>
                    </Grid>
                    <Grid item xs={2}>
                        {trainingTickets.length > 0 &&
                            <Typography variant="h6" sx={{mb: 2,}}>Training Tickets</Typography>}
                        {trainingTickets.map((ticket, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ExpandMore/>}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>{ticket.lesson.identifier} - {ticket.lesson.name}</Typography>
                                        <IconButton
                                            onClick={() => setTrainingTickets(trainingTickets.filter((tt, i) => i !== index))}>
                                            <Delete/>
                                        </IconButton>
                                        <Chip label={ticket.passed ? 'PASS' : 'FAIL'}
                                              color={ticket.passed ? 'success' : 'error'}/>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TrainingTicketForm allLessons={allLessons} allCommonMistakes={allCommonMistakes}
                                                        lesson={ticket.lesson} mistakes={ticket.mistakes}
                                                        scores={ticket.scores} hasPassed={ticket.passed}
                                                        onSubmit={(lesson, mistakes, scores, passed) => {
                                                            if (lesson.id !== ticket.lesson.id && trainingTickets.map((t) => t.lesson.id).flat().includes(lesson.id)) {
                                                                toast('Lesson already added', {type: 'error'});
                                                                return;
                                                            }
                                                            setTrainingTickets((prev) => {
                                                                return prev.map((t, i) => {
                                                                    if (i === index) {
                                                                        return {
                                                                            passed,
                                                                            lesson,
                                                                            mistakes,
                                                                            scores,
                                                                        }
                                                                    }
                                                                    return t;
                                                                });
                                                            });
                                                            toast('Ticket saved', {type: 'success'});
                                                        }}/>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 2,}}>New Training Ticket</Typography>
                                <TrainingTicketForm allLessons={allLessons} allCommonMistakes={allCommonMistakes}
                                                    onSubmit={(lesson, mistakes, scores, passed) => {
                                                        if (trainingTickets.map((t) => t.lesson.id).flat().includes(lesson.id)) {
                                                            toast('Lesson already added', {type: 'error'});
                                                            return;
                                                        }
                                                        setTrainingTickets((prev) => {
                                                            return [
                                                                ...prev,
                                                                {
                                                                    passed,
                                                                    lesson,
                                                                    mistakes,
                                                                    scores,
                                                                },
                                                            ];
                                                        });
                                                        toast('Ticket saved', {type: 'success'});
                                                    }}/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{maxWidth: '700px',}} data-color-mode={theme.palette.mode}>
                            <Typography variant="subtitle1" sx={{mb: 1,}}>Additional Comments</Typography>
                            <MarkdownEditor
                                enableScroll={false}
                                minHeight="200px"
                                value={additionalNotes}
                                onChange={(d) => setAdditionalNotes(d)}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{maxWidth: '700px',}} data-color-mode={theme.palette.mode}>
                            <Typography variant="subtitle1" sx={{mb: 1,}}>Trainer Comments</Typography>
                            <MarkdownEditor
                                enableScroll={false}
                                minHeight="200px"
                                value={trainerNotes}
                                onChange={(d) => setTrainerNotes(d)}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <FormSaveButton/>
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );

}