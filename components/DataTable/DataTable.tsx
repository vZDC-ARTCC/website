'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {
    DataGrid, getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridPaginationModel,
    GridSortModel,
    GridToolbar
} from "@mui/x-data-grid";
import {toast} from "react-toastify";
import {Box} from "@mui/material";

export const equalsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'equals');
export const containsOnlyFilterOperator = getGridStringOperators().filter((operator) => operator.value === 'contains');

export default function DataTable<T>(
    {
        columns,
        initialPagination = {page: 0, pageSize: 10},
        pageSizeOptions = [5, 10, 20],
        initialFilter,
        initialSort,
        fetchData
    }:
        {
            columns: GridColDef[],
            initialPagination?: GridPaginationModel,
            pageSizeOptions?: number[],
            initialFilter?: GridFilterItem,
            initialSort?: GridSortModel,
            fetchData: (pagination: GridPaginationModel, sortModel: GridSortModel, filter?: GridFilterItem) => Promise<{
                data: T[],
                rowCount: number,
            }>,
        }
) {

    const [data, setData] = useState<T[]>();
    const [pagination, setPagination] = useState(initialPagination);
    const [rowCount, setRowCount] = useState(0);
    const [filter, setFilter] = useState(initialFilter);
    const [sortModel, setSortModel] = useState(initialSort || []);

    const getData = useCallback(async () => {
        try {
            const {data, rowCount} = await fetchData(pagination, sortModel, filter);
            setData(data);
            setRowCount(rowCount);
        } catch (err) {
            toast('Failed to fetch data', {type: 'error'});
        }
    }, [fetchData, filter, pagination, sortModel]);

    useEffect(() => {
        getData().then();
    }, [getData]);

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
        <Box sx={{boxSizing: 'border-box', width: '100%',}}>
            <DataGrid
                sx={{mt: 2,}}
                loading={!data}
                rows={data || []}
                autoHeight
                columns={columns}
                pagination
                paginationMode="server"
                filterMode="server"
                sortingMode="server"
                paginationModel={pagination}
                rowCount={rowCount}
                onPaginationModelChange={handlePaginationModelChange}
                onFilterModelChange={handleFilterChange}
                sortModel={sortModel}
                onSortModelChange={handleSortChange}
                pageSizeOptions={pageSizeOptions}
                slots={{
                    toolbar: GridToolbar,
                }}
                disableRowSelectionOnClick
            />
        </Box>

    );

}