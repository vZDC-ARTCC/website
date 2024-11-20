import React from 'react';
import RosterTable from "@/components/Roster/RosterTable";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Visitor Roster | vZDC',
    description: 'vZDC visitor roster page',
};

export default async function Page(
    props: { searchParams: Promise<{ search?: string, includeVatusa?: string, }> }
) {
    const searchParams = await props.searchParams;
    return (
        <RosterTable membership="visit" search={searchParams.search}
                     includeVatusa={searchParams.includeVatusa === 'true'}/>
    );
}