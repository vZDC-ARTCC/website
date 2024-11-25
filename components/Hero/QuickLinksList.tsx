import React from 'react';
import Link from "next/link";
import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {AirplanemodeActive, BarChart, BugReport, ListAlt, OpenInNew, PersonAdd, Route} from "@mui/icons-material";

export default function QuickLinksList() {
    return (
        <List>
            <Link href="/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <AirplanemodeActive/>
                    </ListItemIcon>
                    <ListItemText primary="Airport Database"/>
                </ListItemButton>
            </Link>
            <Link href="/controllers/roster/home" style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <ListAlt/>
                    </ListItemIcon>
                    <ListItemText primary="Roster"/>
                </ListItemButton>
            </Link>
            <Link href="/visitor/new" style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <PersonAdd/>
                    </ListItemIcon>
                    <ListItemText primary="Visitor Application"/>
                </ListItemButton>
            </Link>
            <Link href="/prd" style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <Route/>
                    </ListItemIcon>
                    <ListItemText primary="Preferred Route Database"/>
                </ListItemButton>
            </Link>
            <Link href="/controllers/statistics" style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <BarChart/>
                    </ListItemIcon>
                    <ListItemText primary="Statistics"/>
                </ListItemButton>
            </Link>
            <Link href="https://github.com/vZDC-ARTCC/website/issues" target="_blank"
                  style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <BugReport/>
                    </ListItemIcon>
                    <ListItemText primary="Report a Bug"/>
                </ListItemButton>
            </Link>
            <Link href="https://www.vatusa.net" target="_blank"
                  style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <OpenInNew/>
                    </ListItemIcon>
                    <ListItemText primary="VATUSA"/>
                </ListItemButton>
            </Link>
            <Link href="https://www.vatsim.net" target="_blank"
                  style={{textDecoration: 'none', color: 'inherit',}}>
                <ListItemButton>
                    <ListItemIcon>
                        <OpenInNew/>
                    </ListItemIcon>
                    <ListItemText primary="VATSIM"/>
                </ListItemButton>
            </Link>
        </List>
    );
}