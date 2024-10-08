'use client';
import React, {useCallback, useEffect} from 'react';
import {CommonMistake, Lesson, LessonRubricCell, LessonRubricCriteria, RubricCriteraScore} from "@prisma/client";
import {
    Alert,
    Autocomplete,
    Button,
    Chip,
    CircularProgress,
    Grid2,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import LessonRubricGridInteractive from "@/components/Lesson/LessonRubricGridInteractive";
import {getCriteriaForLesson} from "@/actions/trainingSessionFormHelper";
import {toast} from "react-toastify";
import {Check} from "@mui/icons-material";
import Markdown from "react-markdown";

export default function TrainingTicketForm({
                                               allLessons,
                                               allCommonMistakes,
                                               lesson,
                                               mistakes,
                                               scores,
                                               onSubmit
                                           }: {
    allLessons: Lesson[],
    allCommonMistakes: CommonMistake[],
    lesson?: Lesson,
    mistakes?: CommonMistake[],
    scores?: RubricCriteraScore[],
    onSubmit: (lesson: Lesson, mistakes: CommonMistake[], scores: RubricCriteraScore[]) => boolean
}) {

    const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(lesson || null);
    const [selectedMistakes, setSelectedMistakes] = React.useState<CommonMistake[]>(mistakes || []);
    const [criteria, setCriteria] = React.useState<LessonRubricCriteria[]>();
    const [cells, setCells] = React.useState<LessonRubricCell[]>();
    const [rubricScores, setRubricScores] = React.useState<RubricCriteraScore[]>(scores || []);

    const getCriteria = useCallback(async (lessonId: string) => {
        const {criteria, cells} = await getCriteriaForLesson(lessonId);
        setCriteria(criteria);
        setCells(cells);
    }, []);

    const handleSubmit = async () => {
        if (!selectedLesson || !criteria || !cells) {
            toast('Please select a lesson', {type: 'error'});
            return;
        }
        const success = onSubmit(selectedLesson, selectedMistakes, rubricScores.length !== criteria.length ?
            criteria.map((criterion) => {
                return {
                    id: '',
                    criteriaId: criterion.id,
                    cellId: cells.find((cell) => cell.criteriaId === criterion.id && cell.points === 0)?.id || '',
                    trainingTicketId: null,
                    passed: false,
                };
            }) : rubricScores);
        if (success && !scores) {
            setRubricScores([]);
            setSelectedLesson(null);
            setSelectedMistakes([]);
            setCriteria(undefined);
            setCells(undefined);
        }
    }

    useEffect(() => {
        if (selectedLesson) {
            getCriteria(selectedLesson.id).then();
        }
    }, [getCriteria, selectedLesson]);

    return (
        (<Grid2 container columns={2} spacing={2}>
            <Grid2
                size={{
                    xs: 2,
                    md: 1
                }}>
                <Autocomplete
                    disabled={!!scores}
                    options={allLessons}
                    getOptionLabel={(option) => `${option.identifier} - ${option.name}`}
                    value={selectedLesson}
                    onChange={(event, newValue) => {
                        setSelectedLesson(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Lesson (search name or identifier)"/>}
                />
            </Grid2>
            <Grid2
                size={{
                    xs: 2,
                    md: 1
                }}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={allCommonMistakes}
                    getOptionLabel={(option) => `${option.facility ? option.facility + ' - ' : ''}${option.name}`}
                    value={selectedMistakes}
                    onChange={(event, newValue) => {
                        setSelectedMistakes(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Common Mistakes (search name or facility)"/>}
                    renderOption = {(props, option) => {
                        return(
                            <li {...props}>                        
                                <>
                                    <Tooltip placement="left" title={<h2><Markdown>{option.description}</Markdown></h2>}>
                                        <Typography>{option.facility ? option.facility + ' - ' + option.name: option.name}</Typography>
                                    </Tooltip>
                                </>
                            </li>
                        )}
                    }
                    renderTags={(value, props)=>{
                        return value.map((option, index) => (
                            <Tooltip key={index} placement="top-start" title={<h2><Markdown>{option.description}</Markdown></h2>}>
                                <Chip {...props({index})} key={index+1000} label={option.facility ? option.facility + ' - ' + option.name : option.name}/>
                            </Tooltip>
                        ))
                    }}
                />
            </Grid2>
            <Grid2 size={2}>
                {selectedLesson && (!criteria || !cells) && <CircularProgress/>}
                {criteria && cells && <LessonRubricGridInteractive criteria={criteria} cells={cells} scores={scores}
                                                                   updateScores={(scores) => {
                                                                       setRubricScores(Object.keys(scores).map((criteriaId) => {
                                                                           return {
                                                                               id: '',
                                                                               criteriaId,
                                                                               cellId: cells.find((cell) => cell.criteriaId === criteriaId && cell.points === scores[criteriaId])?.id || '',
                                                                               trainingTicketId: null,
                                                                               passed: scores[criteriaId] >= (criteria.find((c) => c.id === criteriaId)?.passing || 0),
                                                                           }
                                                                       }));
                                                                   }}/>}
            </Grid2>
            <Grid2 size={2}>
                <Button variant="contained" onClick={handleSubmit} startIcon={<Check/>}>Save Ticket</Button>
            </Grid2>
            <Grid2 size={2}>
                <Alert severity="warning">
                    If the lesson pass standards, criteria, or rubric cells have changed after the ticket was previously
                    saved, the ticket will be re-scored with the new criteria.
                </Alert>
            </Grid2>
        </Grid2>)
    );

}