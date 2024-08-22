'use client';
import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {formatZuluDate} from "@/lib/date";
import {fetchTrainerReleases} from "@/actions/trainingAssignmentRelease";
import Link from "next/link";
import {IconButton} from "@mui/material";
import {Visibility} from "@mui/icons-material";
import TrainerAssignmentRequestDeleteButton
    from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestDeleteButton";
import TrainerReleaseRequestApproveButton from "@/components/TrainerReleaseRequest/TrainerReleaseRequestApproveButton";
import TrainerReleaseDeleteButton from "@/components/TrainerReleaseRequest/TrainerReleaseDeleteButton";

export default function TrainerReleaseRequestTable({isInstructorOrStaff}: { isInstructorOrStaff: boolean }) {

    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => `${params.row.student.firstName} ${params.row.student.lastName} (${params.row.student.cid})` || 'Unknown',
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'submittedAt',
            flex: 1,
            headerName: 'Submitted At',
            renderCell: (params) => formatZuluDate(params.row.submittedAt),
            filterable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            renderCell: (params) => isInstructorOrStaff && (
                <div>
                    <TrainerReleaseRequestApproveButton studentId={params.row.student.id}/>
                    <TrainerReleaseDeleteButton studentId={params.row.student.id}/>
                </div>
            ),
            sortable: false,
            filterable: false,
            flex: 1,
        }
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'submittedAt', sort: 'asc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const releases = await fetchTrainerReleases(pagination, sortModel, filter);
                       return {data: releases[1], rowCount: releases[0]};
                   }}/>
    );
}