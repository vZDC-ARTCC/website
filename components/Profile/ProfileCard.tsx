import React from 'react';
import {Avatar, Box, Card, CardContent, Grid, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {getRating, getSubtitle} from "@/lib/vatsim";
import {User} from "next-auth";
import {Edit} from "@mui/icons-material";
import Link from "next/link";

export default async function ProfileCard({user, editButton}: { user: User, editButton?: boolean }) {

    return (
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.avatarUrl}/>
                        <Box>
                            <Typography variant="h6">{user.fullName}</Typography>
                            <Typography variant="body2">{getSubtitle(user)}</Typography>
                        </Box>
                    </Stack>

                    {editButton && <Box>
                        <Link href="/profile/edit" style={{color: 'inherit',}}>
                            <Tooltip title="Edit Profile">
                                <IconButton color="inherit">
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </Box>}
                </Stack>

                <Grid container columns={2} spacing={2} sx={{mt: 1,}}>
                    <Grid item xs={2} sm={1}>
                        <Typography variant="subtitle2">VATSIM CID</Typography>
                        <Typography variant="body2">{user.cid}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body2">{user.email}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <Typography variant="subtitle2">Preferred Name</Typography>
                        <Typography variant="body2">{user.preferredName || 'None'}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <Typography variant="subtitle2">Rating</Typography>
                        <Typography variant="body2">{getRating(user.rating)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2">Bio</Typography>
                        <Typography variant="body2">{user.bio || 'None'}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}