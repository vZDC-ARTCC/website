'use client';
import React from 'react';
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import Link from "next/link";
import {Chip, Tooltip} from "@mui/material";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchProgressionAssignments} from "@/actions/progressionAssignment";
import ProgressionAssignmentDeleteButton from "@/components/ProgressionAssignment/ProgressionAssignmentDeleteButton";
import {Edit} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import ProgressionAssignmentStatusButton from "@/components/ProgressionAssignment/ProgressionAssignmentStatusButton";

export default function ProgressionAssignmentsTable({allowEdit}: { allowEdit: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => {
                const color = params.row.controllerStatus === "HOME" ? 'default' : 'secondary';

                return (
                    <Tooltip title={`${params.row.controllerStatus}`}>
                        <Link href={`/admin/controller/${params.row.cid}`} target="_blank"
                              style={{textDecoration: 'none',}}>
                            <Chip
                                key={params.row.id}
                                label={`${params.row.firstName} ${params.row.lastName}` || 'Unknown'}
                                size="small"
                                color={color}
                            />
                        </Link>
                    </Tooltip>
                )
            },
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'trainingProgression',
            flex: 1,
            headerName: 'Progression',
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            renderCell: (params) => {
                return (
                    <Chip
                        key={params.row.trainingProgression.id}
                        label={params.row.trainingProgression.name}
                        size="small"
                    />
                )
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <ProgressionAssignmentStatusButton user={params.row} progression={params.row.trainingProgression}/>,
                allowEdit ? <GridActionsCellItem
                    icon={<Edit/>}
                    label="Edit"
                    onClick={() => router.push(`/training/progressions/assignments/${params.row.cid}`)}
                /> : <></>,
                allowEdit ? <ProgressionAssignmentDeleteButton user={params.row}/> : <></>,
            ],
        }
    ];

    return (
        <DataTable
            columns={columns}
            fetchData={async (pagination, sortModel, filter,) => {
                const fetchedUsers = await fetchProgressionAssignments(pagination, sortModel, filter);
                return {data: fetchedUsers[1], rowCount: fetchedUsers[0]};
            }}
        />
    );
}