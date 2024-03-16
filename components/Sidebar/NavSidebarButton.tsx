'use client';
import React, {MouseEventHandler, ReactNode} from 'react';
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {KeyboardArrowRight} from "@mui/icons-material";

export default function NavSidebarButton({icon, text, onClick, isSidebar}: {
    icon: ReactNode,
    text: string,
    onClick?: MouseEventHandler,
    isSidebar?: boolean,
}) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text}/>
                {isSidebar && <KeyboardArrowRight/>}
            </ListItemButton>
        </ListItem>
    );
}