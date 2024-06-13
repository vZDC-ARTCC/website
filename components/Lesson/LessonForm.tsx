'use client';
import React from 'react';
import {Lesson} from "@prisma/client";
import {Box, FormControlLabel, FormGroup, Grid, MenuItem, Switch, TextField, Typography, useTheme} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {createOrUpdateLessonDetails} from "@/actions/lesson";
import {toast} from "react-toastify";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {useRouter} from 'next/navigation';

export default function LessonForm({lesson}: { lesson?: Lesson, }) {

    const theme = useTheme();
    const router = useRouter();
    const [description, setDescription] = React.useState<string>(lesson?.description || '')

    const handleSubmit = async (formData: FormData) => {
        const {id, error,} = await createOrUpdateLessonDetails(formData);

        if (error) {
            toast(error.errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        if (!lesson?.id) {
            router.replace(`/training/lessons/${id}/edit`);
        }
        toast("Lesson saved successfully!", {type: 'success'});
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="lessonId" value={lesson?.id || ''}/>
            <input type="hidden" name="description" value={description}/>
            <Grid container columns={2} spacing={2}>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="identifier" label="Indentifier"
                               defaultValue={lesson?.identifier || ''} required/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="name" label="Name" defaultValue={lesson?.name || ''}
                               required/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="facility" label="Facility"
                               defaultValue={lesson?.facility || ''} required/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="position" label="Position"
                               defaultValue={lesson?.position || ''} required/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField
                        select
                        label="Location"
                        name="location"
                        required
                        defaultValue={2}
                        helperText="This is for VATUSA"
                    >
                        <MenuItem value={0}>
                            Classroom
                        </MenuItem>
                        <MenuItem value={1}>
                            Live
                        </MenuItem>
                        <MenuItem value={2}>
                            Sweatbox
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={2}>
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked={lesson?.instructorOnly}/>}
                                          name="instructorOnly" label="Instructor Only?"/>
                        <FormControlLabel control={<Switch defaultChecked={lesson?.notifyInstructorOnPass}/>}
                                          name="notifyInstructorOnPass" label="Notify Instructors on PASS?"/>
                    </FormGroup>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{maxWidth: '700px',}} data-color-mode={theme.palette.mode}>
                        <Typography variant="subtitle1" sx={{mb: 1,}}>Description</Typography>
                        <MarkdownEditor
                            enableScroll={false}
                            minHeight="300px"
                            value={description}
                            onChange={(d) => setDescription(d)}
                        />
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <FormSaveButton/>
                </Grid>
            </Grid>
        </form>
    );

}