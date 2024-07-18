'use client'
import {Box, FormControlLabel, Grid, Switch, TextField, Typography, useTheme} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import React from "react";
import {toast} from "react-toastify";
import FormSaveButton from "@/components/Form/FormSaveButton";
import { createChangeLog } from "@/actions/changeLog";
import {useRouter, useSearchParams} from "next/navigation";

export default function ChangeLogForm() {

    const router = useRouter();
    const theme = useTheme();
    const [versionNumber, setVersionNumber] = React.useState<string>('')
    const [changeLogDetails, setChangeLogDetails] = React.useState<string>('')

    const handleSubmit = async () => {

        const {
            addChangeLog,
            errors
        } = await createChangeLog(versionNumber, changeLogDetails);

        if (errors) {
            toast(errors.map((e) => e.message).join(".  "), {type: 'error'});
            return;
        }

        router.replace(`/admin/changelog`)

        // if (!trainingSession?.id) {
        //     if (session){
        //     router.replace(`/training/sessions/${session.id}`);
        //     }

        // router.replace(`/training/sessions`);

        // }
        toast("Change log saved successfully!", {type: 'success'});
    }


    return(
        <form action={handleSubmit}>
            <Box sx={{}} marginBottom={3} data-color-mode={theme.palette.mode}>
                <TextField 
                    id="outlined-basic" 
                    label="Version Number" 
                    variant="outlined" 
                    value={versionNumber}
                    onChange={(d)=>{setVersionNumber(d.target.value)}}
                />
                <br/>
                <br/>
                <Typography variant="subtitle1" sx={{mb: 1,}}>Changelog Version Description</Typography>
                <MarkdownEditor
                    enableScroll={false}
                    minHeight="200px"
                    value={changeLogDetails}
                    onChange={(d) => {setChangeLogDetails(d)}}
                />
            </Box>
            <FormSaveButton/>
        </form>
    )
}