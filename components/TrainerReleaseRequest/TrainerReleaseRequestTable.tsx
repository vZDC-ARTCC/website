'use client';
import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {formatZuluDate} from "@/lib/date";
import {fetchTrainerReleases} from "@/actions/trainingAssignmentRelease";
import TrainerReleaseRequestApproveButton from "@/components/TrainerReleaseRequest/TrainerReleaseRequestApproveButton";
import TrainerReleaseDeleteButton from "@/components/TrainerReleaseRequest/TrainerReleaseDeleteButton";

export default function TrainerReleaseRequestTable({manageMode}: { manageMode: boolean }) {

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
            getActions: (params) => manageMode ? [
                <TrainerReleaseRequestApproveButton key={params.row.id} studentId={params.row.student.id}/>,
                <TrainerReleaseDeleteButton key={params.row.id} studentId={params.row.student.id}/>,
            ] : [],
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