'use client';
import React, {ReactNode, useState} from 'react';
import {Box, Drawer, IconButton, List, Stack, Tooltip, Typography} from "@mui/material";
import {Close, Menu} from "@mui/icons-material";
import Logo from "@/components/Logo/Logo";

export default function NavSidebar({
                                       children, title, initialOpen, openButton, onClose = () => {
    },
                                   }: {
    children?: ReactNode,
    title: string,
    initialOpen?: boolean,
    openButton?: boolean,
    onClose?: () => void,
}) {

    const [open, setOpen] = useState(initialOpen);

    return (
        <>
            {openButton && <Tooltip title="Open Sidebar">
                <IconButton color="inherit" onClick={() => setOpen(true)} sx={{display: {xl: 'none',},}}>
                    <Menu/>
                </IconButton>
            </Tooltip>}
            <Drawer open={open} onClose={() => openButton ? setOpen(false) : onClose()} hideBackdrop={!openButton}>
                <Stack direction="column" spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between"
                           sx={{padding: 2,}}>
                        <Logo/>
                        <Tooltip title="Close Sidebar">
                            <IconButton onClick={() => openButton ? setOpen(false) : onClose()}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography variant="h6" textAlign="center" sx={{px: 1,}}>{title}</Typography>
                    <List onClick={() => onClose()}>
                        {children}
                    </List>
                </Stack>

            </Drawer>
        </>
    );
}