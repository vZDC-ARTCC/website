'use client';
import React, {useState} from 'react';
import NavButton from "@/components/Navbar/NavButton";
import {
    AddComment,
    AirplanemodeActive, BarChart,
    CalendarMonth, Campaign,
    Description, DeveloperBoard,
    FileDownload, Handshake, Newspaper,
    PersonAdd,
    Radar, Route
} from "@mui/icons-material";
import Link from "next/link";
import NavSidebarButton from "@/components/Sidebar/NavSidebarButton";
import NavSidebar from "@/components/Sidebar/NavSidebar";
import LoginButton from "@/components/Navbar/LoginButton";

export default function NavSidebarButtons() {

    const [openChildSidebar, setOpenChildSidebar] = useState<string>();

    return (
        <>
            {openChildSidebar === "pilots" &&
                <NavSidebar initialOpen title="Pilots" onClose={() => setOpenChildSidebar(undefined)}>
                    <Link href="/charts" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Description/>} text="Chart Database"/>
                    </Link>
                    <Link href="/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<AirplanemodeActive/>} text="Airports"/>
                    </Link>
                </NavSidebar>}

            {openChildSidebar === "controllers" &&
                <NavSidebar initialOpen title="Controllers" onClose={() => setOpenChildSidebar(undefined)}>
                    <Link href="/controllers/roster" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Description/>} text="Roster"/>
                    </Link>
                    <Link href="/visitor/new" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<PersonAdd/>} text="Visit ZDC"/>
                    </Link>
                    <Link href="/controllers/statistics" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<BarChart/>} text="Statistics"/>
                    </Link>
                    <Link href="/prd" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Route/>} text="Preferred Routes Database"/>
                    </Link>
                    <Link href="https://ids.vzdc.org" target="_blank"
                          style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<DeveloperBoard/>} text="IDS"/>
                    </Link>
                    <Link href="https://asx.vzdc.org" target="_blank"
                          style={{textDecoration: 'none', color: 'inherit', cursor: 'not-allowed',}}>
                        <NavSidebarButton icon={<Radar/>} text="ASX"/>
                    </Link>
                </NavSidebar>}

            {openChildSidebar === "publications" &&
                <NavSidebar initialOpen title="Publications" onClose={() => setOpenChildSidebar(undefined)}>
                    <Link href="/publications/announcements" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Campaign/>} text="Announcements"/>
                    </Link>
                    <Link href="/publications/news" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Newspaper/>} text="News"/>
                    </Link>
                    <Link href="/publications/sops" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Description/>} text="SOPs"/>
                    </Link>
                    <Link href="/publications/loas" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Handshake/>} text="LOAs"/>
                    </Link>
                    <Link href="/publications/downloads" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<FileDownload/>} text="Downloads"/>
                    </Link>
                </NavSidebar>}

            {openChildSidebar === "events" &&
                <NavSidebar initialOpen title="Events" onClose={() => setOpenChildSidebar(undefined)}>
                    <Link href="/staffing/new" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<PersonAdd/>} text="Request Staffing"/>
                    </Link>
                    <Link href="/events" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<CalendarMonth/>} text="Events"/>
                    </Link>
                </NavSidebar>}

            <NavSidebarButton icon={<AirplanemodeActive/>} text="Pilots" onClick={() => setOpenChildSidebar("pilots")}
                              isSidebar={true}/>
            <NavSidebarButton icon={<Radar/>} text="Controllers" onClick={() => setOpenChildSidebar("controllers")}
                              isSidebar={true}/>
            <NavSidebarButton icon={<FileDownload/>} text="Publications"
                              onClick={() => setOpenChildSidebar("publications")} isSidebar={true}/>
            <NavSidebarButton icon={<CalendarMonth/>} text="Events" onClick={() => setOpenChildSidebar("events")}
                              isSidebar={true}/>

            <Link href="/feedback/new" style={{color: 'inherit', textDecoration: 'none',}}>
                <NavSidebarButton icon={<AddComment/>} text="Feedback"/>
            </Link>
        </>
    );
}