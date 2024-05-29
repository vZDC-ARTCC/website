'use client';
import React from 'react';
import {CommonMistake} from "@prisma/client";
import {Box, Grid, TextField, Typography, useTheme} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateMistake} from "@/actions/mistake";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function CommonMistakeForm({mistake}: { mistake?: CommonMistake, }) {

    const theme = useTheme();
    const router = useRouter();
    const [description, setDescription] = React.useState<string>(mistake?.description || '');

    const handleSubmit = async (formData: FormData) => {
        const error = await createOrUpdateMistake(formData);

        if (error) {
            toast(error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        toast("Mistake saved successfully!", {type: 'success'});
        router.push(`/training/mistakes/`);
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="mistakeId" value={mistake?.id || ''}/>
            <input type="hidden" name="description" value={description}/>
            <Grid container columns={2} spacing={2}>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="name" required label="Name"
                               defaultValue={mistake?.name || ''}/>
                </Grid>
                <Grid item xs={2} md={1}>
                    <TextField fullWidth variant="filled" name="facility" label="Facility (optional)"
                               helperText="Specifying a facility will aid trianers in looking for facility specific mistakes."
                               defaultValue={mistake?.facility || ''}/>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{maxWidth: '700px',}} data-color-mode={theme.palette.mode}>
                        <Typography variant="h6" sx={{mb: 2,}}>Description</Typography>
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