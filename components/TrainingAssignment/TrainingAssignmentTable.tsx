'use client';
import React from 'react';
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {GridColDef} from "@mui/x-data-grid";
import {Chip, IconButton, Stack} from "@mui/material";
import {User} from "next-auth";
import {fetchTrainingAssignments} from "@/actions/trainingAssignment";
import {Edit} from "@mui/icons-material";
import Link from "next/link";
import TrainingAssignmentDeleteButton from "@/components/TrainingAssignment/TrainingAssignmentDeleteButton";

export default function TrainingAssignmentTable({isInstructorOrStaff}: { isInstructorOrStaff: boolean }) {

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
            renderCell: (params) => isInstructorOrStaff && (
                <div>
                    <Link href={`/training/assignments/${params.row.id}`} passHref>
                        <IconButton size="small">
                            <Edit/>
                        </IconButton>
                    </Link>
                    <TrainingAssignmentDeleteButton assignment={params.row}/>
                </div>
            ),
            sortable: false,
            filterable: false,
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