'use server';
import {z} from "zod";
import {Chart} from "@/types";

export const fetchCharts = async (icao: string) => {

    const icaoZ = z.string().toUpperCase().length(4, "ICAO must be 4 characters");
    const result = icaoZ.parse(icao);

    const res = await fetch(`https://api.aviationapi.com/v1/charts?apt=${result}`);
    const data = await res.json();
    const charts: unknown[] = data[icao] || [];
    return charts.map((chart: any) => {
        return {
            category: chart.chart_code,
            name: chart.chart_name,
            url: chart.pdf_path,
        }
    }) as Chart[];
}