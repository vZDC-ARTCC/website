import React from 'react';
import RosterTable from "@/components/Roster/RosterTable";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Visitor Roster | vZDC',
    description: 'vZDC visitor roster page',
};


export default function Page({searchParams}: { searchParams: { search?: string, } }) {
    return (
        <RosterTable membership="visit" search={searchParams.search}/>
    );
}