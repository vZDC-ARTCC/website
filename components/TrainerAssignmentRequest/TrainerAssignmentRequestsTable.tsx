'use client';
import React from 'react';
import {User} from "next-auth";
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {Visibility} from "@mui/icons-material";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchRequests} from "@/actions/trainingAssignmentRequest";
import {formatZuluDate} from "@/lib/date";
import TrainerAssignmentRequestDeleteButton
    from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestDeleteButton";
import {useRouter} from "next/navigation";

export default function TrainerAssignmentRequestsTable({manageMode}: { manageMode: boolean }) {

    const router = useRouter();

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
            field: 'interestedTrainers',
            flex: 1,
            headerName: 'Interested Trainers',
            renderCell: (params) => params.row.interestedTrainers.map((trainer: User) => `${trainer.firstName} ${trainer.lastName} (${trainer.cid})`).join(', ') || 'None',
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
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.row.id}
                    icon={<Visibility/>}
                    label="View Request"
                    onClick={() => router.push(`/training/requests/${params.row.id}`)}
                />,
                manageMode ? <TrainerAssignmentRequestDeleteButton key={params.row.id} request={params.row}/> : <></>,
            ],
            flex: 1,
        }
    ];

    return (
        <DataTable
            columns={columns}
            initialSort={[{field: 'submittedAt', sort: 'asc',}]}
            fetchData={async (pagination, sort, filter) => {
                const requests = await fetchRequests(pagination, sort, filter);
                return {data: requests[1], rowCount: requests[0]};
            }}
        />
    );
}