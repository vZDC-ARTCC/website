import React from 'react';
import RosterTable from "@/components/Roster/RosterTable";

export default function Page({searchParams}: { searchParams: { search?: string, } }) {
    return (
        <RosterTable membership="home" search={searchParams.search}/>
    );
}