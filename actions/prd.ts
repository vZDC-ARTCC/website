'use server';

import {PreferredRoute} from "@/types";

export const getPrdRoutes = async (origin?: string, destination?: string) => {
    if (!origin || !destination) return [];
    if(origin.toLowerCase().startsWith('k')) origin = origin.substring(1);
    if(destination.toLowerCase().startsWith('k')) destination = destination.substring(1);
    const res = await fetch(`https://api.aviationapi.com/v1/preferred-routes/search?origin=${origin}&dest=${destination}`);
    if (!res.ok) return [];
    const data: PreferredRoute[] = await res.json();
    return data;
}