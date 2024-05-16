'use client';
import React, {useState} from 'react';
import {
    Add,
    AddComment,
    AirplanemodeActive,
    BarChart,
    CalendarMonth,
    Campaign,
    Description,
    DeveloperBoard,
    FileDownload,
    Handshake,
    ListAlt,
    Newspaper,
    PersonAdd,
    Radar,
    Route
} from "@mui/icons-material";
import Link from "next/link";
import NavButton from "@/components/Navbar/NavButton";
import {Box, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import NavDropdown from "@/components/Navbar/NavDropdown";
import {NAVIGATION} from "@/lib/navigation";

export default function NavButtons() {

    const [dropdownOpen, setDropdownOpen] = useState<string | undefined>();
    const [dropdownAnchor, setDropdownAnchor] = useState<HTMLElement | null>(null);

    const openDropdown = (element: HTMLElement, dropdownId: string) => {
        setDropdownAnchor(element);
        setDropdownOpen(dropdownId);
    }
    const closeDropdown = () => {
        setDropdownAnchor(null);
        setDropdownOpen(undefined);
    }

    return (
        <>
            {NAVIGATION.map((button, idx) => (
                <Box key={idx}>
                    <Link href={button.link || ''} style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavButton icon={button.icon} text={button.label}
                                   onClick={(e) => openDropdown(e.currentTarget as HTMLElement, idx.toString())}
                                   isDropdown={!!button.dropdown}/>
                    </Link>
                    {button.dropdown && (
                        <NavDropdown open={dropdownOpen === idx.toString()} anchorElement={dropdownAnchor}
                                     onClose={closeDropdown}>
                            {button.dropdown.buttons.map((dropdownButton, idx) => (
                                <Link key={idx} href={dropdownButton.link}
                                      style={{textDecoration: 'none', color: 'inherit',}}>
                                    <MenuItem onClick={closeDropdown}>
                                        <ListItemIcon>
                                            {dropdownButton.icon}
                                        </ListItemIcon>
                                        <ListItemText>{dropdownButton.label}</ListItemText>
                                    </MenuItem>
                                </Link>
                            ))}
                        </NavDropdown>
                    )}
                </Box>
            ))}
        </>
    );
}

