import prisma from "@/lib/db";

export async function GET() {

    const now = new Date();
    const vatsimUpdate = await prisma.vatsimUpdateMetadata.findFirst();

    if (vatsimUpdate && vatsimUpdate.timestamp.getTime() > now.getTime() - 1000 * 10) {
        return Response.json({ ok: false, });
    }

    const allControllers = await prisma.user.findMany({
        select: {
            id: true,
            cid: true,
            log: {
                include: {
                    months: {
                        select: {
                            month: true,
                            year: true,
                            deliveryHours: true,
                            groundHours: true,
                            towerHours: true,
                            approachHours: true,
                            centerHours: true,
                        }
                    },
                },
            },
        },
    });

    const vatsimData = await fetchVatsimControllerData();

    for (const controller of vatsimData) {
        const user = allControllers.find((user) => user.cid === controller.cid + '');
        if (!user) {
            continue;
        }
        const month = now.getMonth();
        const year = now.getFullYear();
        const log = user.log?.months.find((controllerMonth) => controllerMonth.month === month && controllerMonth.year === year);


        if (!log) {
            await prisma.controllerLogMonth.create({
                data: {
                    month,
                    year,
                    deliveryHours: 0,
                    groundHours: 0,
                    towerHours: 0,
                    approachHours: 0,
                    centerHours: 0,
                    log: {
                        connectOrCreate: {
                            create: {
                                userId: user.id,
                            },
                            where: {
                                userId: user.id,
                            },
                        },
                    },
                },
            });

        }
    }

    await prisma.vatsimUpdateMetadata.upsert({
        where: {
            id: vatsimUpdate?.id || '',
        },
        update: {
            timestamp: now,
        },
        create: {
            timestamp: now,
        },
    });

    return Response.json({ ok: true, });
}

const fetchVatsimControllerData = async () => {
    const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
    const data: {
        cid: number,
        callsign: string,
        frequency: string,
        last_updated: Date,
        logon_time: Date,
    }[] = await res.json();
    return data.filter((controller) => !controller.frequency.startsWith('199'));
}