import React from 'react';
import {AppBar, Stack, Toolbar} from "@mui/material";
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
                    <NavButtons/>
                </Stack>
                <span style={{flexGrow: 1,}}></span>
                <ColorModeSwitcher/>
                <LoginButton session={session}/>
            </Toolbar>
        </AppBar>
    );
}