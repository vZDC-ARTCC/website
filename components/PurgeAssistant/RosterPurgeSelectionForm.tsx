'use client';
import React from 'react';
import {usePathname, useRouter} from "next/navigation";
import {Box, Button, MenuItem, Stack, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";
import {z} from "zod";
import {toast} from "react-toastify";

const months = [
    {
        value: 0,
        label: 'January',
    },
    {
        value: 1,
        label: 'February',
    },
    {
        value: 2,
        label: 'March',
    },
    {
        value: 3,
        label: 'April',
    },
    {
        value: 4,
        label: 'May',
    },
    {
        value: 5,
        label: 'June',
    },
    {
        value: 6,
        label: 'July',
    },
    {
        value: 7,
        label: 'August',
    },
    {
        value: 8,
        label: 'September',
    },
    {
        value: 9,
        label: 'October',
    },
    {
        value: 10,
        label: 'November',
    },
    {
        value: 11,
        label: 'December',
    },
]

export default function RosterPurgeSelectionForm({startMonth, endMonth, maxHours, year}: {
    startMonth: number,
    endMonth: number,
    maxHours: number,
    year: number
}) {

    const router = useRouter();
    const pathname = usePathname();

    const handleSubmit = async (formData: FormData) => {
        const selectionZ = z.object({
            year: z.number(),
            startMonth: z.number().min(0, "Start month has to be bigger than 0").max(11, "Start month has to be smaller than 11"),
            endMonth: z.number().min(0, "End month has to be bigger than 0").max(11, "End month has to be smaller than 11"),
            maxHours: z.number(),
        });

        const result = selectionZ.safeParse({
            year: parseInt(formData.get("year") as string),
            startMonth: parseInt(formData.get("startMonth") as string),
            endMonth: parseInt(formData.get("endMonth") as string),
            maxHours: parseInt(formData.get("maxHours") as string),
        });

        if (!result.success) {
            toast(result.error.errors.map((e) => e.message).join(".  "), {type: 'error'})
            return;
        }

        if (result.data.startMonth > result.data.endMonth) {
            toast("Start month cannot be after end month", {type: 'error'})
            return;
        }

        const {year, startMonth, endMonth, maxHours} = result.data;
        const search = new URLSearchParams();
        search.set("year", year.toString());
        search.set("startMonth", startMonth.toString());
        search.set("endMonth", endMonth.toString());
        search.set("maxHours", maxHours.toString());
        router.push(`${pathname}?${search.toString()}`);
    }

    return (
        <Box sx={{my: 2,}}>
            <form action={handleSubmit}>
                <Stack direction={{xs: 'column', md: 'row',}} spacing={2} alignItems="center">
                    <TextField
                        id="year"
                        required
                        fullWidth
                        type="number"
                        label="Year"
                        variant="filled"
                        defaultValue={year}
                        name="year"
                    />
                    <TextField
                        id="startMonth"
                        required
                        fullWidth
                        type="number"
                        select
                        label="Start Month"
                        variant="filled"
                        defaultValue={startMonth >= 0 && startMonth}
                        name="startMonth"
                    >
                        {months.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="endMonth"
                        required
                        fullWidth
                        type="number"
                        select
                        label="End Month"
                        variant="filled"
                        defaultValue={endMonth >= 0 && endMonth}
                        name="endMonth"
                    >
                        {months.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                </Stack>
                <TextField
                    sx={{mt: 2,}}
                    id="maxHours"
                    required
                    fullWidth
                    type="number"
                    label="Max Hours"
                    variant="filled"
                    defaultValue={maxHours}
                    name="maxHours"
                    helperText="This will show all controllers that have less than this amount of hours"
                />
                <Box>
                    <Button type="submit" variant="contained" startIcon={<Search/>} size="large">Search</Button>
                </Box>
            </form>
        </Box>
    );
}