import React from 'react';
import RosterTable from "@/components/Roster/RosterTable";

export default function Page({searchParams}: { searchParams: { search?: string, } }) {
    return (
        <RosterTable membership="visit" search={searchParams.search}/>
    );
}