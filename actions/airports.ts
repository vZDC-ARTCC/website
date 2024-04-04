'use server';

import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {Airport, Runway, RunwayInstruction, TraconGroup} from "@prisma/client";

export const upsertInstruction = async (instruction: RunwayInstruction, runwayId: string) => {
    const result = await prisma.runwayInstruction.upsert({
        create: {
            ...instruction,
            runwayId,
        },
        update: instruction,
        where: {
            id: instruction.id || '',
        },
        include: {
            runway: {
                include: {
                    airport: true,
                },
            },
        },
    });
    await log(instruction.id ? "UPDATE" : "CREATE", "AIRPORT_PROCEDURE", `Saved procedure '${result.route}' for runway ${result.runway.name} at ${result.runway.airport.icao}`);
    revalidatePath(`/admin/airports/airport/${result.runway.airport.id}/${result.runway.id}`);
    return result;
}
export const upsertRunway = async (runway: Runway, airportId: string) => {
    const result = await prisma.runway.upsert({
        create: {
            ...runway,
            airportId,
        },
        update: runway,
        where: {
            id: runway.id || '',
        },
        include: {
            airport: true,
        },
    });
    await log(runway.id ? "UPDATE" : "CREATE", "AIRPORT_RUNWAY", `Saved runway ${result.name} at ${result.airport.icao}`);
    revalidatePath(`/admin/airports/airport/${airportId}`);
    revalidatePath(`/airports/${airportId}`);
    return result;
}
export const upsertAirport = async (airport: Airport, traconGroupId: string) => {
    const result = await prisma.airport.upsert({
        create: {
            ...airport,
            traconGroupId,
        },
        update: airport,
        where: {
            id: airport.id || '',
        },
    });
    await log(airport.id ? "UPDATE" : "CREATE", "AIRPORT", `Saved airport ${result.icao} (${result.name})`);
    revalidatePath("/admin/airports");
    revalidatePath("/airports");
    revalidatePath(`/airports/${result.id}`);
    revalidatePath(`/admin/airports/airport/${result.id}`);
    return result;
}

export const upsertTraconGroup = async (traconGroup: TraconGroup) => {
    const result = await prisma.traconGroup.upsert({
        create: traconGroup,
        update: traconGroup,
        where: {
            id: traconGroup.id || '',
        },
    });
    await log(traconGroup.id ? "UPDATE" : "CREATE", "AIRPORT_TRACON_GROUP", `Saved TRACON group ${result.name}`);
    revalidatePath("/admin/airports");
    revalidatePath("/airports");
    return result;
}

export const deleteTraconGroup = async (traconGroupId: string) => {
    const traconGroup = await prisma.traconGroup.delete({
        where: {
            id: traconGroupId,
        },
    });
    await log("DELETE", "AIRPORT_TRACON_GROUP", `Deleted TRACON group ${traconGroup.name}`);
    revalidatePath("/admin/airports");
    revalidatePath("/airports");
    return traconGroup;
}
export const deleteAirport = async (icao: string) => {
    const airport = await prisma.airport.delete({
        where: {
            icao,
        }
    });
    await log("DELETE", "AIRPORT", `Deleted airport ${airport.icao} (${airport.name})`);
    revalidatePath("/admin/airports");
    revalidatePath("/airports");
    revalidatePath(`/airports/${airport.id}`);
    return airport;
}

export const deleteRunway = async (runwayId: string) => {
    const runway = await prisma.runway.delete({
        where: {
            id: runwayId,
        },
        include: {
            airport: true,
        },
    });
    await log("DELETE", "AIRPORT_RUNWAY", `Deleted runway ${runway.name} at ${runway.airport.icao}`);
    revalidatePath("/admin/airports");
    revalidatePath("/airports");
    revalidatePath(`/admin/airports/airport/${runway.airport.id}`);
    revalidatePath(`/airports/${runway.airport.id}`);
    return runway;
}

export const deleteProcedure = async (procedureId: string) => {
    const procedure = await prisma.runwayInstruction.delete({
        where: {
            id: procedureId,
        },
        include: {
            runway: {
                include: {
                    airport: true,
                },
            },
        },
    });
    await log("DELETE", "AIRPORT_PROCEDURE", `Deleted procedure ${procedure.route} for runway ${procedure.runway.name} at ${procedure.runway.airport.icao}`);
    revalidatePath(`/admin/airports/airport/${procedure.runway.airport.id}/${procedure.runway.id}`);
    return procedure;
}