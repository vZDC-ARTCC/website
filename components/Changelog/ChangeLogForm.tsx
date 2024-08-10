'use client'
import {Box, FormControlLabel, Grid, Switch, TextField, Typography, useTheme} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import React from "react";
import {toast} from "react-toastify";
import FormSaveButton from "@/components/Form/FormSaveButton";
import { createChangeLog, getChangeLog } from "@/actions/changeLog";
import {useRouter, useSearchParams} from "next/navigation";
import {z} from "zod";

export default function ChangeLogForm({changeLog,}: { changeLog?: { changeDetails: { id: string; detail: string; versionId: string; }[]; } & { id: string; versionNumber: string; createdAt: Date; }, }) {

    const router = useRouter();
    const theme = useTheme();
    const [versionNumber, setVersionNumber] = React.useState<string>('')
    const [changeLogDetails, setChangeLogDetails] = React.useState<string>('')

    const getInitialData = React.useCallback(async () => {
        if (changeLog) {
            const changeLogData = await getChangeLog(changeLog.id);
            setVersionNumber(changeLog.versionNumber);
            setChangeLogDetails(changeLog.changeDetails[0].detail)
        }
    },[changeLog])

    React.useEffect(() => {
        getInitialData().then();
    }, [getInitialData])
    // const getInitialData = React.useCallback(async () => {
    //     if (changeLog) {
    //         const changeLog = await getChangeLog(changeLog.id);
    //         setTrainingTickets(tickets.map((ticket) => {
    //             return {
    //                 passed: ticket.scores.every((score) => score.passed),
    //                 lesson: ticket.lesson,
    //                 mistakes: ticket.mistakes,
    //                 scores: ticket.scores,
    //             }
    //         }));
    //     }
    // }, [changeLog]);

    const handleSubmit = async () => {


        const {
            errors
        } = await createChangeLog(versionNumber, changeLogDetails, changeLog?.id);

        if(typeof errors === "object"){
            toast(errors.map((e) => e.message).join(". "), {type: 'error'});
            return;
        }else if(errors){
            toast(errors,{type: 'error'});
            return;
        }
            
        router.replace(`/changelog`)

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