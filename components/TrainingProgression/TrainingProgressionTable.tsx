'use client';
import React from 'react';
import { useRouter } from "next/navigation";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "@/components/DataTable/DataTable";
import { Edit, Layers, Visibility } from "@mui/icons-material";
import TrainingProgressionDeleteButton from "@/components/TrainingProgression/TrainingProgressionDeleteButton";
import { fetchTrainingProgressions } from "@/actions/trainingProgression";
import { Chip, Tooltip } from "@mui/material";

export default function TrainingProgressionTable({ allowEdit = false }: { allowEdit?: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            flex: 1,
            headerName: 'Name',
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'steps',
            type: 'number',
            flex: 1,
            headerName: 'Steps',
            renderCell: (params) => params.row.steps.length,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'students',
            type: 'number',
            flex: 1,
            headerName: 'Students',
            renderCell: (params) => params.row.students.length,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'nextProgression',
            flex: 1,
            headerName: 'Next Progression',
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            renderCell: (params) => {
                return params.row.nextProgression ? (
                    <Chip
                        key={params.row.nextProgression.id}
                        label={params.row.nextProgression.name}
                        size="small"
                    />
                ) : '';
            },
        },
        {
            field: 'autoAssignNewHomeObs',
            flex: 1,
            headerName: 'Auto Assign New Home OBS',
            type: 'boolean',
        },
        {
            field: 'autoAssignNewVisitor',
            flex: 1,
            headerName: 'Auto Assign New Visitor',
            type: 'boolean',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: (params) => [
                <Tooltip title="View Training Progression">
                    <GridActionsCellItem
                        key={params.row.id}
                        icon={<Visibility />}
                        label="View Training Progression"
                        onClick={() => router.push(`/training/progressions/${params.row.id}`)}
                    />
                </Tooltip>,
                allowEdit ? (
                    <Tooltip title="Progression Steps">
                        <GridActionsCellItem
                            icon={<Layers />}
                            label="Progression Steps"
                            onClick={() => router.push(`/training/progressions/${params.row.id}/edit/steps`)}
                        />
                    </Tooltip>
                ) : <></>,
                allowEdit ? (
                    <Tooltip title="Edit">
                        <GridActionsCellItem
                            icon={<Edit />}
                            label="Edit"
                            onClick={() => router.push(`/training/progressions/${params.row.id}/edit`)}
                        />
                    </Tooltip>
                ) : <></>,
                allowEdit ? <TrainingProgressionDeleteButton trainingProgression={params.row} /> : <></>,
            ],
        },
    ];

    return (
        <DataTable
            columns={columns}
            initialSort={[{ field: 'name', sort: 'asc' }]}
            fetchData={async (pagination, sortModel, filter) => {
                const fetchedProgressions = await fetchTrainingProgressions(pagination, sortModel, filter);
                return { data: fetchedProgressions[1], rowCount: fetchedProgressions[0] };
            }}
        />
    );

}