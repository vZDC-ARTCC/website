import React from 'react';
import {AppBar, Box, Stack, Toolbar} from "@mui/material";
import ColorModeSwitcher from "@/components/Navbar/ColorModeSwitcher";
import Logo from "@/components/Logo/Logo";
import NavButtons from "@/components/Navbar/NavButtons";
import LoginButton from "@/components/Navbar/LoginButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import RootSidebar from "@/components/Sidebar/RootSidebar";

export default async function Navbar() {

    const session = await getServerSession(authOptions);

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Stack direction="row" spacing={2} alignItems="center">
                    <RootSidebar session={session}/>
                    <Logo/>
                    <Box sx={{display: {xs: 'none', xl: 'flex',},}}>
                        <NavButtons/>
                    </Box>
                </Stack>
                <span style={{flexGrow: 1,}}></span>
                <Box>
                    <ColorModeSwitcher/>
                    <Box sx={{display: {xs: 'none', sm: 'inline-block',},}}>
                        <LoginButton session={session}/>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}