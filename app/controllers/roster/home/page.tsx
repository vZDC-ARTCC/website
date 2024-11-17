import React from 'react';
import RosterTable from "@/components/Roster/RosterTable";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Home Roster | vZDC',
    description: 'vZDC home roster page',
};

export default async function Page(
    props: { searchParams: Promise<{ search?: string, includeVatusa?: string, }> }
) {
    const searchParams = await props.searchParams;
    return (
        <RosterTable membership="home" search={searchParams.search}
                     includeVatusa={searchParams.includeVatusa === 'true'}/>
    );
}