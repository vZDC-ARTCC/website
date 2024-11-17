import React from 'react';
import AirportInformation from "@/components/Airports/AirportInformation";

export default async function Page(props: { params: Promise<{ icao: string, }> }) {
    const params = await props.params;

    const {icao} = params;

    return <AirportInformation icao={icao}/>
}