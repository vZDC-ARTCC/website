'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {
    DataGrid,
    getGridSingleSelectOperators,
    getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
    GridToolbar
} from "@mui/x-data-grid";
import {fetchLogs} from "@/actions/log";
import {toast} from "react-toastify";
import {LogModel, LogType} from "@prisma/client";

const equalsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'equals');
const containsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'contains');


export default function LogTable({onlyModels}: { onlyModels?: LogModel[], }) {
    const [logs, setLogs] = useState<any[]>([]);
    const [pagination, setPagination] = useState({page: 0, pageSize: 20, rowCount: 0});
    const [filter, setFilter] = useState<GridFilterItem>();
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'timestamp',
            sort: 'desc',
        }
    ]);

    const columns: GridColDef[] = [
        {
            field: 'timestamp',
            flex: 1,
            headerName: 'Timestamp',
            type: 'dateTime',
            filterable: false,
        },
        {
            field: 'user',
            flex: 1,
            headerName: 'User',
            renderCell: (params) => `${params.row.user?.firstName} ${params.row.user?.lastName} (${params.row.user?.cid})` || 'Unknown',
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'type',
            flex: 1,
            type: 'singleSelect',
            valueOptions: Object.keys(LogType).map((model) => ({value: model, label: model})),
            headerName: 'Type',
            sortable: false,
            filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
        },
        {
            field: 'model',
            flex: 1,
            type: 'singleSelect',
            valueOptions: onlyModels?.map((model) => ({
                value: model,
                label: model
            })) || Object.keys(LogModel).map((model) => ({value: model, label: model})),
            headerName: 'Model',
            width: 200,
            sortable: false,
            filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
        },
        {
            field: 'message',
            flex: 2,
            headerName: 'Message',
            width: 400,
            sortable: false,
            filterable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
    ];

    const fetchData = useCallback(async () => {
        try {
            const fetchedLogs = await fetchLogs(pagination, sortModel, filter, onlyModels); // Assuming you're only sorting by one column
            setLogs(fetchedLogs[1]);
            if (fetchedLogs[0] !== pagination.rowCount) {
                setPagination((prevPagination) => ({
                    ...prevPagination,
                    rowCount: fetchedLogs[0],
                }));
            }
        } catch (error) {
            alert(error)
            toast('Error fetching logs', {type: 'error'});
        }
    }, [filter, onlyModels, pagination, sortModel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // create a method to handle filtering by name, type, and model
    const handleFilterChange = (newFilters: GridFilterModel) => {
        setFilter(newFilters.items[0]);
    }

    const handlePaginationModelChange = (newPagination: GridPaginationModel) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            ...newPagination,
        }));
    }

    const handleSortChange = (newSortModel: GridSortModel) => {
        setSortModel(newSortModel);
    };

    return (
        <DataGrid
            sx={{mt: 2,}}
            rows={logs}
            columns={columns}
            pagination
            paginationMode="server"
            filterMode="server"
            sortingMode="server"
            paginationModel={pagination}
            rowCount={pagination.rowCount}
            onPaginationModelChange={handlePaginationModelChange}
            onFilterModelChange={handleFilterChange}
            sortModel={sortModel}
            onSortModelChange={handleSortChange}
            pageSizeOptions={[5, 10, 20]}
            slots={{
                toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
        />

    );
}