'use client'
import {Box, FormControlLabel, Grid, Switch, TextField, Typography, useTheme} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import React from "react";
import {createOrUpdateTrainingSession} from "@/actions/trainingSession";
import {toast} from "react-toastify";
import FormSaveButton from "@/components/Form/FormSaveButton";

export default function ChangeLogForm() {

    const theme = useTheme();

    const handleSubmit = async () => {


    }


    return(
        <form action={handleSubmit}>
            <Box sx={{}} marginBottom={3} data-color-mode={theme.palette.mode}>
                <TextField id="outlined-basic" label="Version Number" variant="outlined" />
                <br/>
                <br/>
                <Typography variant="subtitle1" sx={{mb: 1,}}>Changelog Version Description</Typography>
                    <MarkdownEditor
                        enableScroll={false}
                        minHeight="200px"
                        //value={}
                        //onChange={(d) => }
                    />
            </Box>
            <FormSaveButton/>
        </form>
    )
}