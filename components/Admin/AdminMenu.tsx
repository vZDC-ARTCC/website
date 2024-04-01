import React from 'react';
import {Card, Badge, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {Badge as BadgeIcon, Book, Feedback, Home, ListAlt, MilitaryTech, Task} from "@mui/icons-material";
import prisma from "@/lib/db";

export default async function AdminMenu() {

    const pendingVisitorApplications = await prisma.visitorApplication.findMany({
        where: {
            status: "PENDING",
        },
    });

    const pendingFeedback = await prisma.feedback.findMany({
        where: {
            status: "PENDING",
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Facility Administration</Typography>
                <List>
                    <Link href="/admin/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/certification-types" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <MilitaryTech/>
                            </ListItemIcon>
                            <ListItemText primary="Certification Types"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/controller" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <BadgeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Controller Management"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/visitor-applications" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={pendingVisitorApplications.length}>
                                    <Task/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Visitor Applications"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/feedback" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={pendingFeedback.length}>
                                    <Feedback/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Feedback"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/logs" style={{textDecoration: 'none', color: 'inherit',}}>
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