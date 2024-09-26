'use client';
import React from 'react';
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {Chip, Stack} from "@mui/material";
import {User} from "next-auth";
import {fetchTrainingAssignments} from "@/actions/trainingAssignment";
import {Edit} from "@mui/icons-material";
import TrainingAssignmentDeleteButton from "@/components/TrainingAssignment/TrainingAssignmentDeleteButton";
import {useRouter} from "next/navigation";
import {getRating} from "@/lib/vatsim";
import Link from "next/link";
import {Lesson} from "@prisma/client";

export default function TrainingAssignmentTable({manageMode}: { manageMode: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => `${params.row.student.firstName} ${params.row.student.lastName}` || 'Unknown',
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'cid',
            flex: 1,
            headerName: 'CID',
            sortable: false,
            renderCell: (params) => params.row.student.cid,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'rating',
            flex: 1,
            headerName: 'Rating',
            renderCell: (params) => getRating(params.row.student.rating),
            filterable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'lastSession',
            flex: 1,
            headerName: 'Last Training Session',
            renderCell: (params) => params.row.student.trainingSessions[0]?.tickets.map((ticket: {
                id: string,
                lesson: Lesson,
                passed: boolean,
            }) => {
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
            }) || 'N/A',
            filterable: false,
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'primaryTrainer',
            headerName: 'Primary Trainer',
            renderCell: (params) => <Link href={`/training/controller/${params.row.primaryTrainer.cid}`}
                                          target="_blank">
                <Chip
                    label={`${params.row.primaryTrainer.firstName} ${params.row.primaryTrainer.lastName} - ${getRating(params.row.primaryTrainer.rating)}`}
                    size="small"/>
            </Link>,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            sortable: false,
            flex: 1
        },
        {
            field: 'otherTrainers',
            headerName: 'Other Trainers',
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    {params.row.otherTrainers.map((trainer: User) => (
                        <Link key={trainer.id} href={`/training/controller/${trainer.cid}`} target="_blank">
                            <Chip label={`${trainer.firstName} ${trainer.lastName} - ${getRating(trainer.rating)}`}
                                  size="small"/>
                        </Link>
                    ))}
                </Stack>
            ),
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            sortable: false,
            flex: 1
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            getActions: (params) => manageMode ? [
                <GridActionsCellItem
                    key={params.row.id}
                    icon={<Edit/>}
                    label="Edit Assignment"
                    onClick={() => router.push(`/training/assignments/${params.row.id}`)}
                />,
                <TrainingAssignmentDeleteButton key={params.row.id} assignment={params.row}/>,
            ] : [],
            flex: 1
        },
    ];

    return (
        <DataTable
            columns={columns}
            fetchData={async (pagination, sort, filter) => {
                const assignments = await fetchTrainingAssignments(pagination, sort, filter);
                return {data: assignments[1], rowCount: assignments[0]};
            }}
        />
    );
}