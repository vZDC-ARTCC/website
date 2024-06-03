import prisma from "@/lib/db";

const DEV_MODE = process.env.DEV_MODE === 'true';

export async function GET() {

    if (DEV_MODE) {
        return devUpdate();
    }

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
                            id: true,
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

    for (const controller of allControllers) {
        const vatsimUser = vatsimData.find((user) => user.cid + '' === controller.cid);
        if (!vatsimUser) {
            continue;
        }
        const month = now.getMonth();
        const year = now.getFullYear();
        const log = controller.log?.months.find((controllerMonth) => controllerMonth.month === month && controllerMonth.year === year);

        const onlineTimeSinceLastUpdate = getHoursControlledSinceLastUpdate(vatsimUser.logon_time, vatsimUpdate?.timestamp || new Date());

        if (!log) {
            await prisma.controllerLogMonth.create({
                data: {
                    month,
                    year,
                    deliveryHours: getFacilityType(vatsimUser.facility) === 'DEL' ? onlineTimeSinceLastUpdate : 0,
                    groundHours: getFacilityType(vatsimUser.facility) === 'GND' ? onlineTimeSinceLastUpdate : 0,
                    towerHours: getFacilityType(vatsimUser.facility) === 'TWR' ? onlineTimeSinceLastUpdate : 0,
                    approachHours: getFacilityType(vatsimUser.facility) === 'APP' ? onlineTimeSinceLastUpdate : 0,
                    centerHours: getFacilityType(vatsimUser.facility) === 'CTR' ? onlineTimeSinceLastUpdate : 0,
                    log: {
                        connectOrCreate: {
                            create: {
                                userId: controller.id,
                            },
                            where: {
                                userId: controller.id,
                            },
                        },
                    },
                },
            });
        } else {
            await prisma.controllerLogMonth.update({
                    where: {
                        id: log.id,
                    },
                    data: {
                        deliveryHours: log.deliveryHours + (getFacilityType(vatsimUser.facility) === 'DEL' ? onlineTimeSinceLastUpdate : 0),
                        groundHours: log.groundHours + (getFacilityType(vatsimUser.facility) === 'GND' ? onlineTimeSinceLastUpdate : 0),
                        towerHours: log.towerHours + (getFacilityType(vatsimUser.facility) === 'TWR' ? onlineTimeSinceLastUpdate : 0),
                        approachHours: log.approachHours + (getFacilityType(vatsimUser.facility) === 'APP' ? onlineTimeSinceLastUpdate : 0),
                        centerHours: log.centerHours + (getFacilityType(vatsimUser.facility) === 'CTR' ? onlineTimeSinceLastUpdate : 0),
                    },
                }
            );
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

    return Response.json({ok: true,});
}

const devUpdate = async () => {

    const now = new Date();
    const vatsimUpdate = await prisma.vatsimUpdateMetadata.findFirst();

    const allControllers = await prisma.user.findMany({
        select: {
            id: true,
            cid: true,
            log: {
                include: {
                    months: {
                        select: {
                            id: true,
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

    for (const controller of allControllers) {
        const month = now.getMonth();
        const year = now.getFullYear();
        const log = controller.log?.months.find((controllerMonth) => controllerMonth.month === month && controllerMonth.year === year);

        const onlineTimeSinceLastUpdate = 400 / 3600;

        if (!log) {
            await prisma.controllerLogMonth.create({
                data: {
                    month,
                    year,
                    deliveryHours: onlineTimeSinceLastUpdate,
                    groundHours: onlineTimeSinceLastUpdate,
                    towerHours: onlineTimeSinceLastUpdate,
                    approachHours: onlineTimeSinceLastUpdate,
                    centerHours: onlineTimeSinceLastUpdate,
                    log: {
                        connectOrCreate: {
                            create: {
                                userId: controller.id,
                            },
                            where: {
                                userId: controller.id,
                            },
                        },
                    },
                },
            });
        } else {
            await prisma.controllerLogMonth.update({
                    where: {
                        id: log.id,
                    },
                    data: {
                        deliveryHours: log.deliveryHours + onlineTimeSinceLastUpdate,
                        groundHours: log.deliveryHours + onlineTimeSinceLastUpdate,
                        towerHours: log.deliveryHours + onlineTimeSinceLastUpdate,
                        approachHours: log.deliveryHours + onlineTimeSinceLastUpdate,
                        centerHours: log.deliveryHours + onlineTimeSinceLastUpdate,
                    },
                }
            );
        }

        console.log(log?.deliveryHours);

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
    const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json', {
        cache: "no-store",
    });
    const data: {
        cid: number,
        callsign: string,
        facility: number,
        frequency: string,
        last_updated: Date,
        logon_time: Date,
    }[] = (await res.json()).controllers;
    return data.filter((controller) => !controller.frequency.startsWith('199'));
}

const getHoursControlledSinceLastUpdate = (lastUpdated: Date, lastMetaUpdate: Date) => {
    return (lastUpdated.getTime() - lastMetaUpdate.getTime()) / 1000 / 60 / 60;
}

const getFacilityType = (facility: number) => {
    switch (facility) {
        case 0:
            return 'OBS';
        case 1:
            return 'FSS';
        case 2:
            return 'DEL';
        case 3:
            return 'GND';
        case 4:
            return 'TWR';
        case 5:
            return 'APP';
        case 6:
            return 'CTR';
        default:
            return 'UNK';
    }
}