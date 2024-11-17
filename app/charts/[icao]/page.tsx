import React from 'react';
import ChartsList from "@/components/Charts/ChartsList";
import {Chart} from "@/types";
import {fetchCharts} from "@/actions/charts";

export default async function Page(props: { params: Promise<{ icao: string, }> }) {
    const params = await props.params;

    const {icao} = params;

    const charts: Chart[] = [];

    if (icao) {
        charts.push(...(await fetchCharts(icao)));
    }

    return (
        <ChartsList icao={icao} charts={charts}/>
    );
}