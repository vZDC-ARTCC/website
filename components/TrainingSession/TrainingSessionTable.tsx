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

type TrainingSessionTableProps = {
    id: string;
    start: Date;
    end: Date;
    instructor: User;
    student: User;
    tickets: TrainingTicketTableProps[];
};

type TrainingTicketTableProps = {
    id: string;
    passed: boolean;
    lesson: Lesson;
    mistakes: CommonMistake[];
};

const equalsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'equals');
const containsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'contains');

export default function TrainingSessionTable({admin, isInstructor, mentorCID, onlyUser}: { admin?: boolean, isInstructor?: boolean, mentorCID?: string, onlyUser?: User, }) {

    const [trainingSessions, setTrainingSessions] = useState<TrainingSessionTableProps[]>([]);
    const [pagination, setPagination] = useState({page: 0, pageSize: 20, rowCount: 0});
    const [filter, setFilter] = useState<GridFilterItem>();
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'start',
            sort: 'desc',
        }
    ]);
     
    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => `${params.row.student.firstName} ${params.row.student.lastName} (${params.row.student.cid})` || 'Unknown',
            filterable: !onlyUser,
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'instructor',
            flex: 1,
            headerName: 'Trainer',
            renderCell: (params) => `${params.row.instructor.firstName} ${params.row.instructor.lastName} (${params.row.instructor.cid})` || 'Unknown',
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

    const fetchData = useCallback(async () => {
        try {
            const fetchedSessions = await fetchTrainingSessions(pagination, sortModel, filter, onlyUser); // Assuming you're only sorting by one column
            setTrainingSessions(fetchedSessions[1] as unknown as TrainingSessionTableProps[]);
            if (fetchedSessions[0] !== pagination.rowCount) {
                setPagination((prevPagination) => ({
                    ...prevPagination,
                    rowCount: fetchedSessions[0],
                }));
            }
        } catch (error) {
            toast('Error fetching training sessions.', {type: 'error'});
        }
    }, [filter, onlyUser, pagination, sortModel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (newFilters: GridFilterModel) => {
        setFilter(newFilters.items[0]);
    }

    const handlePaginationModelChange = (newPagination: GridPaginationModel) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            ...newPagination,
        }));
    }

    const handleSortChange = (newSortModel: GridSortModel) => {
        setSortModel(newSortModel);
    };

    return (
        <DataGrid
            sx={{mt: 2,}}
            rows={trainingSessions}
            columns={columns}
            pagination
            paginationMode="server"
            filterMode="server"
            sortingMode="server"
            paginationModel={pagination}
            rowCount={pagination.rowCount}
            onPaginationModelChange={handlePaginationModelChange}
            onFilterModelChange={handleFilterChange}
            sortModel={sortModel}
            onSortModelChange={handleSortChange}
            pageSizeOptions={[5, 10, 20]}
            slots={{
                toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
        />
    );
}