import React from 'react';
import {Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {AccessTime, Badge, BugReport, Feedback, Route, School, Shield} from "@mui/icons-material";
import Link from "next/link";
/*

<ListItemButton sx={{border: 1, borderRadius: 8}}>
 */

export default function LinksCard() {
    return (
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Typography variant="h6" sx={{mb: 2,}}>Quick Links</Typography>

                <List disablePadding>
                    <Link href="https://wkf.ms/4fqZt3O" target="_blank"
                          style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{border: 3, borderRadius: 8, borderColor: 'orange'}}>
                            <ListItemIcon>
                                <Feedback/>
                            </ListItemIcon>
                            <ListItemText primary="General Facility Feedback"/>
                        </ListItemButton>
                    </Link>
                    <Link href="https://training.vzdc.org" target="_blank"
                          style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <School/>
                            </ListItemIcon>
                            <ListItemText primary="Schedule Training Session"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/prd" target="_blank" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <Route/>
                            </ListItemIcon>
                            <ListItemText primary="Preferred Routes Database"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/profile/loa/request" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <AccessTime/>
                            </ListItemIcon>
                            <ListItemText primary="Request an LOA"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/incident/new" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <Shield/>
                            </ListItemIcon>
                            <ListItemText primary="New Incident Report"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/controllers/staff" style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <Badge/>
                            </ListItemIcon>
                            <ListItemText primary="ARTCC Staff"/>
                        </ListItemButton>
                    </Link>
                    <Link href="https://github.com/vZDC-ARTCC/website/issues"
                          style={{color: 'inherit', textDecoration: 'none',}}>
                        <ListItemButton sx={{borderRadius: 8}}>
                            <ListItemIcon>
                                <BugReport/>
                            </ListItemIcon>
                            <ListItemText primary="Report a Bug"/>
                        </ListItemButton>
                    </Link>
                </List>
            </CardContent>
        </Card>
    );
}