import React from 'react';
import {AppBar, Container, Stack, Toolbar, Typography} from "@mui/material";
import Logo from "@/components/Logo/Logo";
import vatusa from "@/public/img/vatusa.png";
import vatsim from "@/public/img/vatsim.png";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <AppBar position="static" sx={{marginTop: 20}}>
            <Toolbar>
                <Container maxWidth="md" sx={{padding: 5,}}>
                    <Typography textAlign="center">&copy; 2024 Virtual Washington Air Route Traffic Control Center, All
                        Rights Reserved.</Typography>
                    <Typography textAlign="center" sx={{marginTop: 1,}}>A sub-division of VATUSA, a division of the
                        VATSIM network.</Typography>
                    <Typography textAlign="center" fontWeight={700} sx={{marginTop: 2,}}>NOT FOR REAL WORLD
                        USE</Typography>
                    <Stack direction={{xs: 'column', lg: 'row',}} spacing={5} justifyContent="center"
                           alignItems="center" sx={{marginTop: 3,}}>
                        <Link href="https://www.vatusa.net/" target="_blank">
                            <Image src={vatusa} alt="VATUSA" height={50}/>
                        </Link>
                        <Logo/>
                        <Link href="https://www.vatsim.net/" target="_blank">
                            <Image src={vatsim} alt="VATSIM" height={50}/>
                        </Link>
                    </Stack>
                </Container>
            </Toolbar>
        </AppBar>
    );
}