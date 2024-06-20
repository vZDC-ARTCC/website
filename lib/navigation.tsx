import React from "react";
import {
    Add,
    AddComment,
    AirplanemodeActive,
    BarChart,
    CalendarMonth,
    Description,
    DeveloperBoard,
    FileDownload,
    FileOpen,
    Group,
    ListAlt,
    PersonAdd,
    Radar,
    Route,
    Chat,
    Radio,
    Forum, OpenInNew
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
                    label: 'ARTCC Staff',
                    link: '/controllers/staff',
                    icon: <Group/>,
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
                {
                    label: 'Training Scheduler',
                    link: 'https://training.vzdc.org/',
                    icon: <OpenInNew/>,
                },
            ],
        },
    },
    {
        label: 'Publications',
        icon: <FileOpen/>,
        dropdown: {
            buttons: [
                {
                    label: 'Wiki',
                    link: 'https://wiki.vzdc.org',
                    icon: <Description/>,
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
        label: 'Community',
        icon: <Chat/>,
        dropdown: {
            buttons: [
                {
                    label: 'Discord',
                    link: '/discord',
                    icon: <Forum/>,
                },
                {
                    label: 'TeamSpeak',
                    link: '/teamspeak',
                    icon: <Radio/>,
                },
            ],
        },
    },
    {
        label: 'Feedback',
        icon: <AddComment/>,
        link: '/feedback/new',
    },
];