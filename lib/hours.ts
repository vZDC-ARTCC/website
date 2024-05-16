import prisma from "@/lib/db";

export async function getMonthHours(month: number, year: number) {
    const monthLogs = await prisma.controllerLogMonth.findMany({
        where: {
            month,
            year
        },
    });

    return monthLogs.reduce((acc, log) => acc + log.deliveryHours + log.groundHours + log.towerHours + log.approachHours + log.centerHours, 0).toPrecision(3);
}

export async function getYearHours(year: number) {
    const yearLogs = await prisma.controllerLogMonth.findMany({
        where: {
            year
        },
    });

    return yearLogs.reduce((acc, log) => acc + log.deliveryHours + log.groundHours + log.towerHours + log.approachHours + log.centerHours, 0).toPrecision(3);
}

export async function getAllTimeHours() {
    const allLogs = await prisma.controllerLogMonth.findMany();

    return allLogs.reduce((acc, log) => acc + log.deliveryHours + log.groundHours + log.towerHours + log.approachHours + log.centerHours, 0).toPrecision(3);
}