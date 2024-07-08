import React from 'react';
import AdminControllerInformation from "@/components/Controller/AdminControllerInformation";

export default async function Page({params}: { params: { cid: string, }, }) {

    const {cid} = params;

    return (
        <AdminControllerInformation cid={cid}/>
    );
}