'use client';
import React, {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Box, FormControlLabel, Stack, Switch, Tab, Tabs, Tooltip} from "@mui/material";
import {Info} from "@mui/icons-material";

export default function RosterTabs() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const rosterType = pathname.substring(20);

    const [selectedRoster, setSelectedRoster] = useState(rosterType);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedRoster(newValue);
        router.push(`/controllers/roster/${newValue}?${searchParams.toString()}`);
    }

    const toggleVatusa = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('includeVatusa', searchParams.get('includeVatusa') === 'true' ? 'false' : 'true');
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <Box>
            <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                    control={<Switch checked={searchParams.get('includeVatusa') === 'true'} onChange={toggleVatusa}
                                     color="primary"/>}
                    label="Include VATUSA Roster"
                />
                <Tooltip
                    title="Toggling this option will include controllers that have not logged in to this website but are on the VATUSA roster.  This option may cause increased loading times depending on VATUSA API response times.">
                    <Info/>
                </Tooltip>
            </Stack>
            <Tabs variant="fullWidth" value={selectedRoster} onChange={handleChange}>
                <Tab label="Home" value="home"/>
                <Tab label="Visiting" value="visit"/>
            </Tabs>
        </Box>

    );
}