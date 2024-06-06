'use client';
import React from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Tab, Tabs} from "@mui/material";

export default function IncidentTabs() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (e: unknown, value: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("closed", value.valueOf());
        router.push(`${pathname}?${newSearchParams.toString()}`, {
            scroll: true,
        });
    }

    const closed = searchParams.get("closed") || "no";

    return (
        <Tabs variant="fullWidth" value={closed} onChange={handleChange}>
            <Tab label="Active" value="no"/>
            <Tab label="Closed" value="yes"/>
        </Tabs>
    );
}