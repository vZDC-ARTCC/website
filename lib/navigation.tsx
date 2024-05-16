import React from "react";
import {
    Add, AddComment,
    AirplanemodeActive,
    BarChart, CalendarMonth, Campaign,
    Description,
    DeveloperBoard,
    FileDownload, Handshake, ListAlt, Newspaper,
    PersonAdd,
    Radar,
    Route
} from "@mui/icons-material";

export type NavigationButton = {
    label: string,
    link?: string,
    icon: React.ReactNode,
    dropdown?: NavigationDropdown,
}

export type DropdownButton = {
    label: string,
    link: string,
    icon: React.ReactNode,
}

export type NavigationDropdown = {
    buttons: DropdownButton[],
}

export const NAVIGATION: NavigationButton[] = [
    {
        label: 'Pilots',
        icon: <AirplanemodeActive/>,
        dropdown: {
            buttons: [
                {
                    label: 'Chart Database',
                    link: '/charts',
                    icon: <Description/>,
                },
                {
                    label: 'Airports',
                    link: '/airports',
                    icon: <AirplanemodeActive/>,
                },
            ],
        },
    },
    {
        label: 'Controllers',
        icon: <Radar/>,
        dropdown: {
            buttons: [
                {
                    label: 'Roster',
                    link: '/controllers/roster/home',
                    icon: <ListAlt/>,
                },
                {
                    label: 'Visit ZDC',
                    link: '/visitor/new',
                    icon: <PersonAdd/>,
                },
                {
                    label: 'Statistics',
                    link: '/controllers/statistics',
                    icon: <BarChart/>,
                },
                {
                    label: 'Preferred Routes Database',
                    link: '/prd',
                    icon: <Route/>,
                },
                {
                    label: 'IDS',
                    link: 'https://ids.vzdc.org',
                    icon: <DeveloperBoard/>,
                },
                {
                    label: 'ASX',
                    link: 'https://asx.vzdc.org',
                    icon: <Radar/>,
                },
            ],
        },
    },
    {
        label: 'Publications',
        icon: <FileDownload/>,
        dropdown: {
            buttons: [
                {
                    label: 'Announcements',
                    link: '/publications/announcements',
                    icon: <Campaign/>,
                },
                {
                    label: 'News',
                    link: '/publications/news',
                    icon: <Newspaper/>,
                },
                {
                    label: 'SOPs',
                    link: '/publications/sops',
                    icon: <Description/>,
                },
                {
                    label: 'LOAs',
                    link: '/publications/loas',
                    icon: <Handshake/>,
                },
                {
                    label: 'Downloads',
                    link: '/publications/downloads',
                    icon: <FileDownload/>,
                },
            ],
        },
    },
    {
        label: 'Events',
        icon: <CalendarMonth/>,
        dropdown: {
            buttons: [
                {
                    label: 'Request Staffing',
                    link: '/staffing/new',
                    icon: <Add/>,
                },
                {
                    label: 'Upcoming Events',
                    link: '/events',
                    icon: <CalendarMonth/>,
                },
            ],
        },
    },
    {
        label: 'Feedback',
        icon: <AddComment/>,
        link: '/feedback/new',
    }
];