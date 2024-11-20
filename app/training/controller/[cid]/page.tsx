import React from 'react';
import AdminControllerInformation from "@/components/Controller/AdminControllerInformation";

export default async function Page(props: { params: Promise<{ cid: string, }>, }) {
    const params = await props.params;

    const {cid} = params;

    return (
        <AdminControllerInformation cid={cid}/>
    );
}