'use client';
import React, {useCallback, useEffect} from 'react';
import {CommonMistake, Lesson, LessonRubricCell, LessonRubricCriteria, RubricCriteraScore} from "@prisma/client";
import {Autocomplete, Button, CircularProgress, FormControlLabel, Grid, Switch, TextField} from "@mui/material";
import LessonRubricGridInteractive from "@/components/Lesson/LessonRubricGridInteractive";
import {getCriteriaForLesson} from "@/actions/trainingSessionFormHelper";
import {toast} from "react-toastify";
import {Check} from "@mui/icons-material";

export default function TrainingTicketForm({
                                               allLessons,
                                               allCommonMistakes,
                                               lesson,
                                               mistakes,
                                               scores,
                                               hasPassed,
                                               onSubmit
                                           }: {
    allLessons: Lesson[],
    allCommonMistakes: CommonMistake[],
    lesson?: Lesson,
    mistakes?: CommonMistake[],
    scores?: RubricCriteraScore[],
    hasPassed?: boolean,
    onSubmit: (lesson: Lesson, mistakes: CommonMistake[], scores: RubricCriteraScore[], passed: boolean) => void
}) {

    const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(lesson || null);
    const [selectedMistakes, setSelectedMistakes] = React.useState<CommonMistake[]>(mistakes || []);
    const [criteria, setCriteria] = React.useState<LessonRubricCriteria[]>();
    const [cells, setCells] = React.useState<LessonRubricCell[]>();
    const [rubricScores, setRubricScores] = React.useState<RubricCriteraScore[]>(scores || []);
    const [passed, setPassed] = React.useState<boolean>(hasPassed || false);

    const getCriteria = useCallback(async (lessonId: string) => {
        const {criteria, cells} = await getCriteriaForLesson(lessonId);
        setCriteria(criteria);
        setCells(cells);
    }, []);

    const handleSubmit = async () => {
        if (!selectedLesson) {
            toast('Please select a lesson', {type: 'error'});
        } else {
            onSubmit(selectedLesson, selectedMistakes, rubricScores, passed);
            if (!lesson) {
                setRubricScores([]);
                setSelectedLesson(null);
                setSelectedMistakes([]);
                setCriteria(undefined);
                setCells(undefined);
                setPassed(false);
            }
        }

    }

    useEffect(() => {
        if (selectedLesson) {
            getCriteria(selectedLesson.id).then();
        }
    }, [getCriteria, selectedLesson]);

    return (
        <Grid container columns={2} spacing={2}>
            <Grid item xs={2} md={1}>
                <Autocomplete
                    options={allLessons}
                    getOptionLabel={(option) => `${option.identifier} - ${option.name}`}
                    value={selectedLesson}
                    onChange={(event, newValue) => {
                        setSelectedLesson(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Lesson"/>}
                />
            </Grid>
            <Grid item xs={2} md={1}>
                <Autocomplete
                    multiple
                    options={allCommonMistakes}
                    getOptionLabel={(option) => `${option.facility ? option.facility + ' - ' : ''}${option.name}`}
                    value={selectedMistakes}
                    onChange={(event, newValue) => {
                        setSelectedMistakes(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Common Mistakes"/>}
                />
            </Grid>
            <Grid item xs={2}>
                {selectedLesson && (!criteria || !cells) && <CircularProgress/>}
                {criteria && cells && <LessonRubricGridInteractive criteria={criteria} cells={cells} scores={scores}
                                                                   updateScores={(scores) => {
                                                                       setRubricScores(Object.keys(scores).map((criteriaId) => {
                                                                           return {
                                                                               id: rubricScores.find((score) => score.criteriaId === criteriaId)?.id || '',
                                                                               criteriaId,
                                                                               cellId: cells.find((cell) => cell.criteriaId === criteriaId && cell.points === scores[criteriaId])?.id || '',
                                                                               trainingTicketId: null,
                                                                           }
                                                                       }));
                                                                   }}/>}
            </Grid>
            <Grid item xs={2}>
                <FormControlLabel control={<Switch checked={passed}/>} label="Passed?"
                                  onChange={(e, c) => setPassed(c)}/>
            </Grid>
            <Grid item xs={2}>
                <Button variant="contained" onClick={handleSubmit} startIcon={<Check/>}>Save Ticket</Button>
            </Grid>
        </Grid>
    );

}