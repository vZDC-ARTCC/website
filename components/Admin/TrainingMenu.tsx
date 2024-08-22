import React from 'react';
import {Badge, Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {
    Class,
    Clear,
    FmdBad,
    Home,
    ListAlt,
    LocalActivity,
    ManageSearch,
    MilitaryTech,
    People,
    PersonAdd,
    School,
    WorkspacePremium,
} from "@mui/icons-material";
import prisma from "@/lib/db";

export default async function TrainingMenu() {

    const soloCertifications = await prisma.soloCertification.count();

    const trainingRequests = await prisma.trainingAssignmentRequest.count();

    const trainingReleaseRequests = await prisma.trainerReleaseRequest.count();

    const ta = await prisma.user.findFirst({
        where: {
            staffPositions: {
                has: "TA",
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Training Administration</Typography>
                <Typography variant="subtitle2"
                            textAlign="center">TA: {ta?.firstName} {ta?.lastName || 'N/A'}</Typography>
                <List>
                    <Link href="/training/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/your-students" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <School/>
                            </ListItemIcon>
                            <ListItemText primary="Your Students"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/sessions" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <LocalActivity/>
                            </ListItemIcon>
                            <ListItemText primary="Training Sessions"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/history" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ManageSearch/>
                            </ListItemIcon>
                            <ListItemText primary="Training History"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/assignments" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <People/>
                            </ListItemIcon>
                            <ListItemText primary="Training Assignments"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/requests" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={trainingRequests}>
                                    <PersonAdd/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Trainer Requests"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/training/releases" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={trainingReleaseRequests}>
                                    <Clear/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Trainer Release Requests"/>
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
                    <Link href="/training/logs" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ListAlt/>
                            </ListItemIcon>
                            <ListItemText primary="Logs"/>
                        </ListItemButton>
                    </Link>
                </List>
            </CardContent>
        </Card>
    );
}

/* this is for training stats

<Link href="/training/statistics" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <QueryStats/>
                            </ListItemIcon>
                            <ListItemText primary="Training Statistics"/>
                        </ListItemButton>
                    </Link>

 */