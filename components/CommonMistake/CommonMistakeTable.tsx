'use client';
import React from 'react';
import {User} from "next-auth";
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {Tooltip} from "@mui/material";
import {Edit, Visibility} from "@mui/icons-material";
import CommonMistakeDeleteButton from "@/components/CommonMistake/CommonMistakeDeleteButton";
import {fetchCommonMistakes} from "@/actions/mistake";
import {useRouter} from "next/navigation";

export default function CommonMistakeTable({user}: { user: User, }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'facility',
            headerName: 'Facility',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <Tooltip title="View Mistake" key={`view-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Visibility/>}
                        label="View Mistake"
                        onClick={() => router.push(`/training/mistakes/${params.row.id}`)}
                    />
                </Tooltip>,
                user.roles.includes("STAFF") ? (
                    <>
                        <Tooltip title="Edit Mistake" key={`edit-${params.row.id}`}>
                            <GridActionsCellItem
                                icon={<Edit/>}
                                label="Edit Mistake"
                                onClick={() => router.push(`/training/mistakes/${params.row.id}/edit`)}
                            />
                        </Tooltip>
                        <CommonMistakeDeleteButton mistake={params.row} key={`delete-${params.row.id}`}/>
                    </>
                ) : <></>,
            ],
        },
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'name', sort: 'asc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const mistakes = await fetchCommonMistakes(pagination, sortModel, filter);
                       return {
                           data: mistakes[1],
                           rowCount: mistakes[0],
                       };
                   }}/>
    );

}