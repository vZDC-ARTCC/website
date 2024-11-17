'use client';
import React from 'react';
import {Event, EventType} from "@prisma/client";
import {
    Box,
    Grid2,
    MenuItem,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme
} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import {toast} from "react-toastify";
import {createOrUpdateEvent} from "@/actions/event";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {StaticImageData} from '@/node_modules/next/image';

const MarkdownEditor = dynamic(
    () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
    { ssr: false }
);

export default function EventForm({event, imageUrl, }: { event?: Event, imageUrl?: string | StaticImageData}) {

    const theme = useTheme();
    const [description, setDescription] = React.useState<string>(event?.description || '');
    const [bannerUploadType, setBannerUploadType] = React.useState('file');
    const router = useRouter();
    dayjs.extend(utc);

    const handleSubmit = async (formData: FormData) => {
        toast("Saving event. This might take a couple seconds.", {type: 'info'})
        const {event, errors} = await createOrUpdateEvent(formData);
        if (errors) {
            toast(errors.map((e) => e.message).join('.  '), {type: 'error'});
            return;
        }
        router.push('/admin/events');
        toast(`Event '${event.name}' saved successfully!`, {type: 'success'});
    }

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
      ) => {
        setBannerUploadType(newAlignment);
      };

    return (
        (<LocalizationProvider dateAdapter={AdapterDayjs}>
            <form action={handleSubmit}>
                <input type="hidden" name="id" value={event?.id}/>
                <input type="hidden" name="description" value={description}/>
                <Grid2 container columns={2} spacing={2}>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <TextField variant="filled" fullWidth name="name" label="Name"
                                   defaultValue={event?.name || ''}/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <TextField variant="filled" fullWidth name="host" label="Host"
                                   helperText="Leave blank if this ARTCC is hosting the event"
                                   defaultValue={event?.host || ''}/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <TextField variant="filled" fullWidth name="featuredFields" label="Featured Fields" helperText="Seperate using commas (IAD,DCA,BWI,KATL)" defaultValue={event?.featuredFields.join(',') || ''} />
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <TextField variant="filled" fullWidth name="type" label="Type" select defaultValue={event?.type || ''}>
                            {Object.keys(EventType).map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <DateTimePicker disablePast name="start" ampm={false} defaultValue={dayjs(event?.start)}
                                        label="Start (Zulu)"/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <DateTimePicker disablePast name="end" ampm={false} defaultValue={dayjs(event?.end)} label="End (Zulu)"/>
                    </Grid2>
                    <Grid2 size={2}>
                        <Box sx={{maxWidth: '700px',}} data-color-mode={theme.palette.mode}>
                            <Typography variant="h6" sx={{ mb: 2, }}>Description</Typography>
                            <MarkdownEditor
                                enableScroll={false}
                                minHeight="300px"
                                value={description}
                                onChange={(d) => setDescription(d)}
                            />
                        </Box>

                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="h6" sx={{mb: 2,}}>Upload Banner Image</Typography>
                        <Stack spacing={2}>
                            <ToggleButtonGroup
                                color="primary"
                                value={bannerUploadType}
                                exclusive
                                onChange={handleChange}
                            >
                                <ToggleButton value="file">File</ToggleButton>
                                <ToggleButton value="url">URL</ToggleButton>
                            </ToggleButtonGroup>

                            {bannerUploadType === "file" ?
                                <input type="file" name="bannerImage" accept="image/*"/> :
                                <TextField variant="filled" type="url" fullWidth name="bannerUrl" label="Image URL"/>}
                        </Stack>
                    </Grid2>
                    {imageUrl &&
                        <Grid2
                            size={{
                                xs: 2,
                                md: 1
                            }}>
                            <Typography variant="h6">Active Banner Image</Typography>
                            <Typography>Click to open in a new tab.</Typography>
                            <Link href={typeof imageUrl === 'string'?imageUrl:''} target="_blank" passHref>
                                <Box sx={{position: 'relative', width: '100%', height: '100%', minHeight: '200px',}}>
                                    <Image src={imageUrl} alt={event?.name || ''} fill style={{objectFit: 'contain',}}/>
                                </Box>
                            </Link>
                        </Grid2>
                    }
                    <Grid2 size={2}>
                        <FormSaveButton />
                    </Grid2>
                </Grid2>
            </form>
        </LocalizationProvider>)
    );

}