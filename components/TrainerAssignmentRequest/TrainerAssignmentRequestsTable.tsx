'use client';
import React from 'react';
import {User} from "next-auth";
import {GridColDef} from "@mui/x-data-grid";
import {IconButton} from "@mui/material";
import {Visibility} from "@mui/icons-material";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchRequests} from "@/actions/trainingAssignmentRequest";
import {formatZuluDate} from "@/lib/date";
import Link from "next/link";
import TrainerAssignmentRequestDeleteButton
    from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestDeleteButton";

export default function TrainerAssignmentRequestsTable({isInstructorOrStaff}: { isInstructorOrStaff: boolean }) {

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
            renderCell: (params) => isInstructorOrStaff && (
                <div>
                    <Link href={`/training/requests/${params.row.id}`}>
                        <IconButton>
                            <Visibility/>
                        </IconButton>
                    </Link>
                    <TrainerAssignmentRequestDeleteButton request={params.row}/>
                </div>
            ),
            sortable: false,
            filterable: false,
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