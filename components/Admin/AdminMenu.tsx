import React from 'react';
import {Badge, Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {
    AddModerator,
    AirplanemodeActive,
    Badge as BadgeIcon,
    CalendarMonth,
    DeleteSweep,
    Feedback,
    Folder,
    Home,
    ListAlt,
    MilitaryTech,
    QuestionAnswer,
    Task
} from "@mui/icons-material";
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

    const staffingRequests = await prisma.staffingRequest.findMany();

    const atm = await prisma.user.findFirst({
        where: {
            staffPositions: {
                has: "ATM",
            },
        },
    });

    const datm = await prisma.user.findFirst({
        where: {
            staffPositions: {
                has: "DATM",
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Facility Administration</Typography>
                <Typography variant="subtitle2"
                            textAlign="center">ATM: {atm?.firstName} {atm?.lastName || 'N/A'}</Typography>
                <Typography variant="subtitle2"
                            textAlign="center">DATM: {datm?.firstName} {datm?.lastName || 'N/A'}</Typography>
                <List>
                    <Link href="/admin/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AirplanemodeActive/>
                            </ListItemIcon>
                            <ListItemText primary="Airports"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/events" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <CalendarMonth/>
                            </ListItemIcon>
                            <ListItemText primary="Events"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/staffing-requests" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={staffingRequests.length}>
                                    <QuestionAnswer/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Staffing Requests"/>
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
                    <Link href="/admin/purge-assistant" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <DeleteSweep/>
                            </ListItemIcon>
                            <ListItemText primary="Purge Assistant"/>
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
                    <Link href="/admin/staff" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AddModerator/>
                            </ListItemIcon>
                            <ListItemText primary="Staff Management"/>
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
                    <Link href="/admin/files" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Folder/>
                            </ListItemIcon>
                            <ListItemText primary="File Center"/>
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