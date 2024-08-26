'use client';
import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchSoloCertifications} from "@/actions/solo";
import SoloCertificationDeleteButton from "@/components/SoloCertification/SoloCertificationDeleteButton";
import {formatZuluDate} from "@/lib/date";
import {getRating} from "@/lib/vatsim";

export default function SoloCertificationTable() {

    const columns: GridColDef[] = [
        {
            field: 'controller',
            headerName: 'Controller',
            flex: 1,
            sortable: false,
            renderCell: (params) => `${params.row.controller.firstName} ${params.row.controller.lastName} (${params.row.controller.cid}} - ${getRating(params.row.controller.rating)}`,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'certificationType',
            headerName: 'Certification Type',
            valueFormatter: (params) => params.value.name,
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'position',
            headerName: 'Position',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {field: 'expires', headerName: 'Expires', flex: 1, valueFormatter: (params) => formatZuluDate(params.value)},
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <SoloCertificationDeleteButton soloCertification={params.row}/>,
            ],
        },
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'expires', sort: 'desc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const soloCertifications = await fetchSoloCertifications(pagination, sortModel, filter);
                       return {
                           data: soloCertifications[1],
                           rowCount: soloCertifications[0],
                       };
                   }}/>
    );
}