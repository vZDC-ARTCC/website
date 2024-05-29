import React from 'react';
import {Badge, Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {Class, FmdBad, Home, LocalActivity, MilitaryTech, WorkspacePremium,} from "@mui/icons-material";
import {User} from "next-auth";
import prisma from "@/lib/db";

export default async function TrainingMenu({user}: { user: User, }) {

    const soloCertifications = await prisma.soloCertification.count();

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Training Administration</Typography>
                <List>
                    <Link href="/training/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/tickets" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <LocalActivity/>
                            </ListItemIcon>
                            <ListItemText primary="Training Sessions"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/controller" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <MilitaryTech/>
                            </ListItemIcon>
                            <ListItemText primary="Certifications"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/solos" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={soloCertifications}>
                                    <WorkspacePremium/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Solo Certifications"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/lessons" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Class/>
                            </ListItemIcon>
                            <ListItemText primary="Lessons"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/mistakes" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <FmdBad/>
                            </ListItemIcon>
                            <ListItemText primary="Mistakes"/>
                        </ListItemButton>
                    </Link>
                </List>
            </CardContent>
        </Card>
    );
}