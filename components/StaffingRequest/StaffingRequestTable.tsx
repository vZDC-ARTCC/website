'use client';
import React from 'react';
import {GridColDef, GridActionsCellItem} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchStaffingRequests} from "@/actions/staffingRequest";
import {useRouter} from "next/navigation";
import {Visibility} from "@mui/icons-material";
import {Tooltip} from "@mui/material";

export default function StaffingRequestTable() {
    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'user',
            headerName: 'User',
            flex: 1,
            sortable: false,
            renderCell: (params) => `${params.row.user.firstName} ${params.row.user.lastName}`,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'cid',
            headerName: 'CID',
            flex: 1,
            valueGetter: (params) => params.row.user.cid,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            valueGetter: (params) => params.row.user.email,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'name',
            headerName: 'Proposed Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <Tooltip title="View Staffing Request" key={`view-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility/>}
                        label="View Staffing Request"
                        onClick={() => router.push(`/admin/staffing-requests/${params.row.id}`)}
                    />
                </Tooltip>,
            ],
        },
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'name', sort: 'asc'}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const staffingRequests = await fetchStaffingRequests(pagination, sortModel, filter);
                       return {
                           data: staffingRequests[1],
                           rowCount: staffingRequests[0],
                       };
                   }}/>
    );
}