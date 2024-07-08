import React from 'react';
import {Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import Link from "next/link";
import {
    AddModerator,
    Home,
    ListAlt,
    Badge
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
                                <Badge/>
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