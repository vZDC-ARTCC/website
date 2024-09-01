'use client';
import React from 'react';
import {getGridSingleSelectOperators, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {format} from "date-fns";
import {fetchEvents} from "@/actions/event";
import {Tooltip} from "@mui/material";
import {Checklist, Edit} from "@mui/icons-material";
import EventDeleteButton from "@/components/Events/EventDeleteButton";
import {EventType} from "@prisma/client";
import {useRouter} from "next/navigation";

export default function EventTable() {
    const eventTypes = Object.keys(EventType).map((type) => ({value: type, label: type}));

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'type',
            type: 'singleSelect',
            headerName: 'Type',
            flex: 1,
            filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
            valueOptions: eventTypes
        },
        {
            field: 'start',
            headerName: 'Start',
            flex: 1,
            valueFormatter: (params) => format(new Date(params.value), 'M/d/yy HHmm') + 'z'
        },
        {
            field: 'end',
            headerName: 'End',
            flex: 1,
            valueFormatter: (params) => format(new Date(params.value), 'M/d/yy HHmm') + 'z'
        },
        {
            field: 'host',
            headerName: 'Host',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <Tooltip title="View Positions" key={`view-positions-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Checklist/>}
                        label="View Positions"
                        onClick={() => router.push(`/admin/events/edit/${params.row.id}/positions`)}
                    />
                </Tooltip>,
                <Tooltip title="Edit Event" key={`edit-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Edit/>}
                        label="Edit Event"
                        onClick={() => router.push(`/admin/events/edit/${params.row.id}`)}
                    />
                </Tooltip>,
                <EventDeleteButton key={params.row.id} event={params.row}/>
            ],
        },
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'start', sort: 'asc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const events = await fetchEvents(pagination, sortModel, filter);
                       return {
                           data: events[1],
                           rowCount: events[0],
                       };
                   }}/>
    );
}