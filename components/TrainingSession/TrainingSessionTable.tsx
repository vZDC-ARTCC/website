'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {User} from "next-auth";
import {CommonMistake, Lesson} from "@prisma/client";
import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
    GridToolbar
} from "@mui/x-data-grid";
import {toast} from "react-toastify";
import {fetchTrainingSessions} from "@/actions/trainingSession";
import {Chip, IconButton} from "@mui/material";
import Link from "next/link";
import {Edit, Visibility} from "@mui/icons-material";
import TrainingSessionDeleteButton from "@/components/TrainingSession/TrainingSessionDeleteButton";
import {formatZuluDate, getDuration} from "@/lib/date";
import { arrayBuffer } from 'stream/consumers';
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";

type TrainingTicketTableProps = {
    id: string;
    passed: boolean;
    lesson: Lesson;
    mistakes: CommonMistake[];
};

export default function TrainingSessionTable({admin, isInstructor, mentorCID, onlyUser}: { admin?: boolean, isInstructor?: boolean, mentorCID?: string, onlyUser?: User, }) {
     
    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => `${params.row.student.firstName} ${params.row.student.lastName}` || 'Unknown',
            filterable: !onlyUser,
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'instructor',
            flex: 1,
            headerName: 'Trainer',
            renderCell: (params) => `${params.row.instructor.firstName} ${params.row.instructor.lastName}` || 'Unknown',
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'start',
            flex: 1,
            headerName: 'Start',
            renderCell: (params) => formatZuluDate(params.row.start),
            type: 'dateTime',
            filterable: false,
        },
        {
            field: 'end',
            flex: 1,
            headerName: 'End',
            renderCell: (params) => formatZuluDate(params.row.end),
            type: 'dateTime',
            filterable: false,
        },
        {
            field: 'duration',
            flex: 1,
            headerName: 'Duration',
            renderCell: (params) => getDuration(params.row.start, params.row.end),
            sortable: false,
            filterable: false,
        },
        {
            field: 'lessons',
            flex: 1,
            headerName: 'Lessons',
            sortable: false,
            renderCell: (params) => params.row.tickets.map((ticket: TrainingTicketTableProps) => {
                const color = ticket.passed ? 'success' : 'error';
                return (
                    <Chip
                        key={ticket.id}
                        label={ticket.lesson.identifier}
                        size="small"
                        color={color}
                        style={{margin: '2px'}}
                    />
                );
            }),
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'tickets',
            renderCell: (params) => params.row.tickets.reduce((acc: number, ticket: {
                mistakes: CommonMistake[],
            }) => acc + ticket.mistakes.length, 0),
            flex: 1,
            headerName: 'Mistakes',
            type: 'number',
            sortable: false,
            filterable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
                <>
                    <Link href={admin ? `/training/sessions/${params.row.id}` : `/profile/training/${params.row.id}`}
                          passHref>
                        <IconButton size="small">
                            <Visibility/>
                        </IconButton>
                    </Link>
                    {(isInstructor || mentorCID==`${params.row.instructor.cid}`) && <Link href={`/training/sessions/${params.row.id}/edit`} passHref>
                        <IconButton size="small">
                            <Edit/>
                        </IconButton>
                    </Link>}
                    {(isInstructor || mentorCID==`${params.row.instructor.cid}`) &&
                        <TrainingSessionDeleteButton trainingSession={params.row}/>
                    }
                </>
            ),
            flex: 1,
            sortable: false,
            filterable: false,
        }
    ];

    return (
        <>
            <DataTable
                columns={columns}
                initialSort={[{field: 'start', sort: 'desc',}]}
                fetchData={async (pagination, sortModel, filter,) => {
                    const fetchedSessions = await fetchTrainingSessions(pagination, sortModel, filter, onlyUser);
                    return {data: fetchedSessions[1], rowCount: fetchedSessions[0]};
                }}
            />
        </>

    );
}