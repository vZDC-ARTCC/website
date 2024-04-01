'use server';

import {PreferredRoute} from "@/types";

export const getPrdRoutes = async (origin?: string, destination?: string) => {
    if (!origin || !destination) return [];
    const res = await fetch(`https://api.aviationapi.com/v1/preferred-routes/search?origin=${origin}&dest=${destination}`);
    if (!res.ok) return [];
    const data: PreferredRoute[] = await res.json();
    return data;
}