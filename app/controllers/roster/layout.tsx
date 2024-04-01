import React from 'react';
import {Container, Stack} from "@mui/material";
import RosterSearch from "@/components/Roster/RosterSearch";
import RosterTabs from "@/components/Roster/RosterTabs";

export default function Layout({children}: { children: React.ReactNode }) {

    return (
        <Container maxWidth="lg">
            <Stack direction="column" spacing={2} sx={{overflow: 'hidden',}}>
                <RosterSearch/>
                <RosterTabs/>
                {children}
            </Stack>
        </Container>
    );
}