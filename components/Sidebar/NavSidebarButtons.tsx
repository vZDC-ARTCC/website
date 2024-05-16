'use client';
import React, {useState} from 'react';
import {
    AddComment,
    AirplanemodeActive,
    BarChart,
    CalendarMonth,
    Campaign,
    Description,
    DeveloperBoard,
    FileDownload,
    Handshake,
    Newspaper,
    PersonAdd,
    Radar,
    Route
} from "@mui/icons-material";
import Link from "next/link";
import NavSidebarButton from "@/components/Sidebar/NavSidebarButton";
import NavSidebar from "@/components/Sidebar/NavSidebar";
import {NAVIGATION} from "@/lib/navigation";
import {Box} from "@mui/material";

export default function NavSidebarButtons() {

    const [openChildSidebar, setOpenChildSidebar] = useState<string>();

    return (
        <>
            {NAVIGATION.map((button, idx) => (
                <Box key={idx}>
                    <Link href={button.link || ''} style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={button.icon} text={button.label}
                                          onClick={() => setOpenChildSidebar(idx.toString())}
                                          isSidebar={!!button.dropdown}/>
                    </Link>
                    {button.dropdown && openChildSidebar === idx.toString() && (
                        <NavSidebar initialOpen title={button.label} onClose={() => setOpenChildSidebar(undefined)}>
                            {button.dropdown.buttons.map((dropdownButton, idx) => (
                                <Link key={idx} href={dropdownButton.link}
                                      style={{textDecoration: 'none', color: 'inherit',}}>
                                    <NavSidebarButton icon={dropdownButton.icon} text={dropdownButton.label}/>
                                </Link>
                            ))}
                        </NavSidebar>
                    )}
                </Box>
            ))}
        </>
    );
}