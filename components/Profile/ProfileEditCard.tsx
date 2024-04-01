'use client';
import React from 'react';
import {User} from "next-auth";
import {Button, Card, CardContent, Divider, Stack, TextField} from "@mui/material";
import {getRating} from "@/lib/vatsim";
import {Save} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";
import {updateCurrentProfile} from "@/actions/profile";
import {useRouter} from "next/navigation";
import {writeDossier} from "@/actions/dossier";

export default function ProfileEditCard({user}: { user: User, }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const User = z.object({
            preferredName: z.string().max(40, "Preferred name must not be over 40 characters").optional(),
            bio: z.string().max(400, "Bio must not be over 400 characters").optional(),
        });

        const result = User.safeParse({
            preferredName: formData.get('preferredName') as string,
            bio: formData.get('bio') as string,
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        const Filter = require('bad-words');
        const filter = new Filter();

        if (filter.isProfane(result.data.preferredName) || filter.isProfane(result.data.bio)) {
            await writeDossier(`Attempted to update profile with profanity in preferred name or bio.`, user.cid);
            toast('Please ensure your preferred name and bio do not contain any profanity.', {type: 'error'});
            return;
        }

        await updateCurrentProfile({...user, ...result.data});
        router.push('/profile/overview');
        toast('Profile updated successfully!', {type: 'success'});
    }

    return (
        <Card>
            <CardContent>
                <form action={handleSubmit}>
                    <Stack direction="column" spacing={2}>
                        <TextField fullWidth disabled variant="filled" label="Name" value={user.fullName}/>
                        <TextField fullWidth disabled variant="filled" label="VATSIM CID" value={user.cid}/>
                        <TextField fullWidth disabled variant="filled" label="Rating" value={getRating(user.rating)}/>
                        <Divider/>
                        <TextField fullWidth variant="filled" name="preferredName" label="Preferred Name"
                                   defaultValue={user.preferredName || ''}/>
                        <TextField fullWidth multiline rows={5} variant="filled" name="bio" label="Bio"
                                   defaultValue={user.bio || ''}/>
                        <Button type="submit" variant="contained" size="large" startIcon={<Save/>}>Save</Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}