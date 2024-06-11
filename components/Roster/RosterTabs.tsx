'use client';
import React, {useState} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {Tab, Tabs} from "@mui/material";

export default function RosterTabs() {

    const router = useRouter();
    const pathname = usePathname();
    const rosterType = pathname.substring(20);

    const [selectedRoster, setSelectedRoster] = useState(rosterType);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedRoster(newValue);
        router.push(`/controllers/roster/${newValue}`);
    }

    return (
        <Tabs variant="fullWidth" value={selectedRoster} onChange={handleChange}>
            <Tab label="Home" value="home"/>
            <Tab label="Visiting" value="visit"/>
        </Tabs>
    );
}