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

export default function TrainingAssignmentTable({manageMode}: { manageMode: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'student',
            headerName: 'Student',
            renderCell: (params) => `${params.row.student.firstName} ${params.row.student.lastName} (${params.row.student.cid})`,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            sortable: false,
            flex: 1
        },
        {
            field: 'primaryTrainer',
            headerName: 'Primary Trainer',
            renderCell: (params) => `${params.row.primaryTrainer.firstName} ${params.row.primaryTrainer.lastName} (${params.row.primaryTrainer.cid})`,
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
                        <Chip key={trainer.id} label={`${trainer.firstName} ${trainer.lastName}`} size="small"/>
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