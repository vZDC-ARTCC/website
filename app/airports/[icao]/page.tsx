import React from 'react';
import AirportInformation from "@/components/Airports/AirportInformation";

export default async function Page({params}: { params: { icao: string, } }) {

    const {icao} = params;

    return <AirportInformation icao={icao}/>

}