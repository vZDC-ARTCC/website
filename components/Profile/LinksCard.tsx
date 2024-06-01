import React from 'react';
import {Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {Badge, BugReport, Route, School, Shield} from "@mui/icons-material";
import Link from "next/link";

export default function LinksCard() {
    return (
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Typography variant="h6" sx={{mb: 2,}}>Quick Links</Typography>

                <List disablePadding>
                    <Link href="https://training.vzdc.org" target="_blank"
                          style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <School/>
                            </ListItemIcon>
                            <ListItemText primary="Schedule Training Session"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/prd" target="_blank" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Route/>
                            </ListItemIcon>
                            <ListItemText primary="Preferred Routes Database"/>
                        </ListItemButton>
                    </Link>
                    <ListItemButton>
                        <ListItemIcon>
                            <Shield/>
                        </ListItemIcon>
                        <ListItemText primary="New Incident Report"/>
                    </ListItemButton>
                    <Link href="/controllers/staff" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge/>
                            </ListItemIcon>
                            <ListItemText primary="ARTCC Staff"/>
                        </ListItemButton>
                    </Link>
                    <ListItemButton>
                        <ListItemIcon>
                            <BugReport/>
                        </ListItemIcon>
                        <ListItemText primary="Report a Bug"/>
                    </ListItemButton>
                </List>
            </CardContent>
        </Card>
    );
}