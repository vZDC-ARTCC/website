'use client';
import React from 'react';
import {Event} from "@prisma/client";
import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {useColorScheme} from "@mui/material/styles";
import {toast} from "react-toastify";
import {createOrUpdateEvent} from "@/actions/event";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
    () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
    { ssr: false }
);

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function EventForm({event, imageUrl, }: { event?: Event, imageUrl?: string }) {

    const {mode} = useColorScheme();
    const [description, setDescription] = React.useState<string>(event?.description || '');
    const router = useRouter();
    dayjs.extend(utc);

    const handleSubmit = async (formData: FormData) => {
        const eventZ = z.object({
            name: z.string().min(1, "Name is required"),
            host: z.string().optional(),
            description: z.string().min(1, "Description is required"),
            start: z.date(),
            end: z.date(),
            featuredFields: z.array(z.string()),
            bannerImage: z.any()
                .optional()
                .refine((file) => {
                    return !file || file.size <= MAX_FILE_SIZE;
                }, 'File size must be less than 4MB')
                .refine((file) => {
                    return ALLOWED_FILE_TYPES.includes(file?.type || '');
                }, 'File must be a PNG, JPEG, or GIF'),
        });

        const result = eventZ.safeParse({
            name: formData.get('name'),
            host: formData.get('host'),
            description,
            start: new Date(formData.get('start') as unknown as string),
            end: new Date(formData.get('end') as unknown as string),
            featuredFields: formData.get('featuredFields')?.toString().split(',').map((f) => f.trim()) || [],
            bannerImage: formData.get('bannerImage') as File,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        formData.set('description', description);
        toast("Saving event...", {type: 'info'})
        const data = await createOrUpdateEvent(formData, event?.id || '');
        router.push('/admin/events');
        toast(`Event '${data.name}' saved successfully!`, {type: 'success'});
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form action={handleSubmit}>
                <Grid container columns={2} spacing={2}>
                    <Grid item xs={2} md={1}>
                        <TextField variant="filled" fullWidth name="name" label="Name"
                                   defaultValue={event?.name || ''}/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <TextField variant="filled" fullWidth name="host" label="Host"
                                   helperText="Leave blank if this ARTCC is hosting the event"
                                   defaultValue={event?.host || ''}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField variant="filled" fullWidth name="featuredFields" label="Featured Fields" helperText="Seperate using commas (IAD,DCA,BWI,KATL)" defaultValue={event?.featuredFields.join(',') || ''} />
                    </Grid>
                    <Grid item xs={2}>
                        <Stack direction="column" spacing={2} data-color-mode={mode}>
                            <Typography variant="h6">Description</Typography>
                            <Box sx={{ minHeight: '350px', }}>
                                <MarkdownEditor value={description} height="300px" onChange={(d) => setDescription(d)}/>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker name="start" defaultValue={dayjs.utc(event?.start)} label="Start"/>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <DateTimePicker name="end" defaultValue={dayjs.utc(event?.end)} label="End"/>
                    </Grid>
                    <Grid item xs={2}>
                        <input type="file" name="bannerImage" accept="image/*" value={imageUrl} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button type="submit" variant="contained" size="large" startIcon={<Save />}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );

}