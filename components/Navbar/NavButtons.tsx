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
import {ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import NavDropdown from "@/components/Navbar/NavDropdown";

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
            <NavDropdown open={dropdownOpen === "pilots"} anchorElement={dropdownAnchor} onClose={closeDropdown}>
                <Link href="/charts" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Description/>
                        </ListItemIcon>
                        <ListItemText>Chart Database</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <AirplanemodeActive/>
                        </ListItemIcon>
                        <ListItemText>Airports</ListItemText>
                    </MenuItem>
                </Link>
            </NavDropdown>

            <NavDropdown open={dropdownOpen === "controllers"} anchorElement={dropdownAnchor} onClose={closeDropdown}>
                <Link href="/controllers/roster" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <ListAlt/>
                        </ListItemIcon>
                        <ListItemText>Roster</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/visitor/new" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <PersonAdd/>
                        </ListItemIcon>
                        <ListItemText>Visit ZDC</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/controllers/statistics" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <BarChart/>
                        </ListItemIcon>
                        <ListItemText>Statistics</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/prd" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Route/>
                        </ListItemIcon>
                        <ListItemText>Preferred Routes Database</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="https://ids.vzdc.org" target="_blank" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <DeveloperBoard/>
                        </ListItemIcon>
                        <ListItemText>IDS</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="https://asx.vzdc.org" target="_blank"
                      style={{textDecoration: 'none', color: 'inherit', cursor: 'not-allowed',}}>
                    <MenuItem onClick={closeDropdown} disabled>
                        <ListItemIcon>
                            <Radar/>
                        </ListItemIcon>
                        <ListItemText>ASX</ListItemText>
                    </MenuItem>
                </Link>
            </NavDropdown>

            <NavDropdown open={dropdownOpen === "publications"} anchorElement={dropdownAnchor} onClose={closeDropdown}>
                <Link href="/publications/announcements" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Campaign/>
                        </ListItemIcon>
                        <ListItemText>Announcements</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/publications/news" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Newspaper/>
                        </ListItemIcon>
                        <ListItemText>News</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/publications/sops" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Description/>
                        </ListItemIcon>
                        <ListItemText>SOPs</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/publications/loas" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Handshake/>
                        </ListItemIcon>
                        <ListItemText>LOAs</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/publications/downloads" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <FileDownload/>
                        </ListItemIcon>
                        <ListItemText>Downloads</ListItemText>
                    </MenuItem>
                </Link>
            </NavDropdown>

            <NavDropdown open={dropdownOpen === "events"} anchorElement={dropdownAnchor} onClose={closeDropdown}>
                <Link href="/staffing/new" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Add/>
                        </ListItemIcon>
                        <ListItemText>Request Staffing</ListItemText>
                    </MenuItem>
                </Link>
                <Link href="/events" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <CalendarMonth/>
                        </ListItemIcon>
                        <ListItemText>Upcoming Events</ListItemText>
                    </MenuItem>
                </Link>
            </NavDropdown>

            <NavButton icon={<AirplanemodeActive/>} text="Pilots"
                       onClick={(e) => openDropdown(e.currentTarget as HTMLElement, "pilots")} isDropdown
                       dropdownOpen={false}/>
            <NavButton icon={<Radar/>} text="Controllers"
                       onClick={(e) => openDropdown(e.currentTarget as HTMLElement, "controllers")} isDropdown
                       dropdownOpen={false}/>
            <NavButton icon={<FileDownload/>} text="Publications"
                       onClick={(e) => openDropdown(e.currentTarget as HTMLElement, "publications")} isDropdown
                       dropdownOpen={false}/>
            <NavButton icon={<CalendarMonth/>} text="Events"
                       onClick={(e) => openDropdown(e.currentTarget as HTMLElement, "events")} isDropdown
                       dropdownOpen={false}/>

            <Link href="/feedback/new" style={{color: 'inherit', textDecoration: 'none',}}>
                <NavButton icon={<AddComment/>} text="Feedback"/>
            </Link>
        </>
    );
}

