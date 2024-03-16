import React from 'react';
import {AppBar, Box, Stack, Toolbar} from "@mui/material";
import ColorModeSwitcher from "@/components/Navbar/ColorModeSwitcher";
import Logo from "@/components/Logo/Logo";
import NavButtons from "@/components/Navbar/NavButtons";
import LoginButton from "@/components/Navbar/LoginButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import NavSidebar from "@/components/Sidebar/NavSidebar";
import NavSidebarButtons from "@/components/Sidebar/NavSidebarButtons";

export default async function Navbar() {

    const session = await getServerSession(authOptions);

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Stack direction="row" spacing={2} alignItems="center">
                    <NavSidebar openButton title="Main Menu">
                        <NavSidebarButtons/>
                        <LoginButton session={session} sidebar/>
                    </NavSidebar>
                    <Logo/>
                    <NavButtons/>
                </Stack>
                <span style={{flexGrow: 1,}}></span>
                <Box sx={{display: {xs: 'none', md: 'flex',},}}>
                    <ColorModeSwitcher/>
                    <LoginButton session={session}/>
                </Box>

            </Toolbar>
        </AppBar>
    );
}