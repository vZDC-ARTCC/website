import React from 'react';
import {Badge, Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {
    AccessTime,
    AddModerator,
    AirplanemodeActive,
    Badge as BadgeIcon,
    BarChart,
    CalendarMonth,
    DeleteSweep,
    Feedback,
    Folder,
    Home,
    ListAlt,
    MilitaryTech,
    QuestionAnswer,
    Report,
    Send,
    Task
} from "@mui/icons-material";
import prisma from "@/lib/db";

export default async function WebmasterMenu() {

    const wm = await prisma.user.findFirst({
        where: {
            staffPositions: {
                has: 'WM',
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Webmaster Administration</Typography>
                <Typography variant="subtitle2"
                            textAlign="center">WM: {wm?.firstName} {wm?.lastName || 'N/A'}</Typography>

                <List>
                    <Link href="/webmaster/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/webmaster/controller" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <BadgeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Controller Management"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/webmaster/staff" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AddModerator/>
                            </ListItemIcon>
                            <ListItemText primary="Staff Management"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/webmaster/logs" style={{textDecoration: 'none', color: 'inherit',}}>
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