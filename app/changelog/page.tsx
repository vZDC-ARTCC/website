import React from 'react';
import ChangeLogOverview from "@/components/Changelog/ChangeLogOverview";

export default async function Page({params}: { params: { id: string } }) {

    return (
        <ChangeLogOverview/>
    );

}