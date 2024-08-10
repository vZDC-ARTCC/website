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
    useTheme,
    Switch,
    FormControlLabel
} from "@mui/material";
import {useRouter, useSearchParams} from "next/navigation";
import {User} from "next-auth";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TrainingTicketForm from "@/components/TrainingSession/TrainingTicketForm";
import {Delete, ExpandMore} from "@mui/icons-material";
import {toast} from "react-toastify";
import MarkdownEditor from "@uiw/react-markdown-editor";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateTrainingSession} from "@/actions/trainingSession"

export default function TrainingSessionForm({trainingSession,}: { trainingSession?: TrainingSession, }) {

    const router = useRouter();
    const theme = useTheme();
    const searchParams = useSearchParams();
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [allCommonMistakes, setAllCommonMistakes] = useState<CommonMistake[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allLoading, setAllLoading] = useState<boolean>(true);
    const [student, setStudent] = useState<string>(trainingSession?.studentId || searchParams.get('student') || '');
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
    const [enableMarkdown, setEnableMarkdown] = useState<boolean>(false);

    const getInitialData = useCallback(async () => {
        setAllLoading(true);
        const {lessons, commonMistakes, users} = await getAllData();
        setAllLessons(lessons.sort(({identifier:a},{identifier:b})=>a.localeCompare(b)));
        setAllCommonMistakes(commonMistakes);
        setAllUsers(users as User[]);
        setAllLoading(false);
        if (trainingSession) {
            const tickets = await getTicketsForSession(trainingSession.id);
            setTrainingTickets(tickets.map((ticket) => {
                return {
                    passed: ticket.scores.every((score) => score.passed),
                    lesson: ticket.lesson,
                    mistakes: ticket.mistakes,
                    scores: ticket.scores,
                }
            }));
        }
    }, [trainingSession]);

    const handleSubmit = async () => {

        const {
            session,
            errors
        } = await createOrUpdateTrainingSession(student, start, end, trainingTickets, additionalNotes, trainerNotes, enableMarkdown, trainingSession?.id);

        if (errors) {
            toast(errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        if (!trainingSession?.id) {
            if (session){
            router.replace(`/training/sessions/${session.id}`);
            }

        router.replace(`/training/sessions`);

        }
        toast("Training session saved successfully!", {type: 'success'});
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
                            disabled={!!trainingSession}
                            options={allUsers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                            value={allUsers.find((u) => u.id === student) || null}
                            onChange={(event, newValue) => {
                                setStudent(newValue ? newValue.id : '');
                            }}
                            renderInput={(params) => <TextField {...params} label="Student"/>}
                        />
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker  ampm={false} label="Start" value={dayjs(start)}
                                        onChange={(d) => setStart(d?.toDate() || null)}/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker  ampm={false} label="End" value={dayjs(end)}
                                        onChange={(d) => setEnd(d?.toDate() || null)}/>
                    </Grid>
                    <Grid item xs={2}>
                        {trainingTickets.length > 0 && <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 2,}}>Training Ticket(s)</Typography>
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
                                            <TrainingTicketForm allLessons={allLessons}
                                                                allCommonMistakes={allCommonMistakes}
                                                                lesson={ticket.lesson} mistakes={ticket.mistakes}
                                                                scores={ticket.scores}
                                                                onSubmit={(lesson, mistakes, scores) => {
                                                                    setTrainingTickets((prev) => {
                                                                        return prev.map((t, i) => {
                                                                            if (i === index) {
                                                                                return {
                                                                                    passed: scores.every((score) => score.passed),
                                                                                    lesson,
                                                                                    mistakes,
                                                                                    scores,
                                                                                }
                                                                            }
                                                                            return t;
                                                                        });
                                                                    });
                                                                    toast('Ticket saved', {type: 'success'});
                                                                    return true;
                                                                }}/>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </CardContent>
                        </Card>}
                    </Grid>
                    <Grid item xs={2}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 2,}}>New Training Ticket</Typography>
                                <TrainingTicketForm allLessons={allLessons} allCommonMistakes={allCommonMistakes}
                                                    onSubmit={(lesson, mistakes, scores) => {
                                                        if (trainingTickets.map((t) => t.lesson.id).flat().includes(lesson.id)) {
                                                            toast('Lesson already added', {type: 'error'});
                                                            return false;
                                                        }
                                                        setTrainingTickets((prev) => {
                                                            return [
                                                                ...prev,
                                                                {
                                                                    passed: scores.every((score) => score.passed),
                                                                    lesson,
                                                                    mistakes,
                                                                    scores,
                                                                },
                                                            ];
                                                        });
                                                        toast('Ticket saved', {type: 'success'});
                                                        return true;
                                                    }}/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{}} data-color-mode={theme.palette.mode}>
                        <FormControlLabel control={<Switch onChange={()=>setEnableMarkdown(!enableMarkdown)}/>} label="Enable Markdown Editor" />
                            <Typography variant="subtitle1" sx={{mb: 1,}}>Additional Comments</Typography>
                            {enableMarkdown ? 
                                <MarkdownEditor
                                    enableScroll={false}
                                    minHeight="200px"
                                    value={additionalNotes}
                                    onChange={(d) => setAdditionalNotes(d)}
                                />
                                :
                                <TextField
                                    multiline
                                    fullWidth
                                    sx={{minHeight:"200px"}}
                                    minRows={10}
                                    variant="outlined"
                                    value={additionalNotes}
                                    onChange={(d)=>setAdditionalNotes(d.target.value)}
                                />
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{}} data-color-mode={theme.palette.mode}>
                            <Typography variant="subtitle1" sx={{mb: 1,}}>Trainer Comments</Typography>
                            {enableMarkdown ?
                                <MarkdownEditor
                                    enableScroll={false}
                                    minHeight="200px"
                                    value={trainerNotes}
                                    onChange={(d) => {setTrainerNotes(d)}}
                                />
                                :
                                <TextField
                                    multiline
                                    fullWidth
                                    sx={{minHeight:"200px"}}
                                    minRows={10}
                                    variant="outlined"
                                    value={trainerNotes}
                                    onChange={(d)=>setTrainerNotes(d.target.value)}
                                />
                            }
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