import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import prisma from "@/lib/db";
import PurgeAssistantTable from "@/components/PurgeAssistant/PurgeAssistantTable";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import RosterPurgeSelectionForm from "@/components/PurgeAssistant/RosterPurgeSelectionForm";
import {permanentRedirect} from "next/navigation";

export default async function Page({searchParams,}: {
    searchParams: { startMonth: string, endMonth: string, maxHours: string, year: string, },
}) {

    const {startMonth, endMonth, maxHours, year,} = searchParams;

    if (!startMonth || !endMonth || !maxHours || !year) {
        permanentRedirect(`/admin/purge-assistant?startMonth=0&endMonth=11&maxHours=3&year=${new Date().getFullYear()}`);
    }
    if (parseInt(startMonth) < 0 || parseInt(endMonth) > 12 || parseInt(startMonth) > parseInt(endMonth)) {
        throw new Error("Invalid month bounds");
    }

    const controllers = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: "NONE",
            },
            log: {
                months: {
                    every: {
                        month: {
                            gte: parseInt(startMonth),
                            lte: parseInt(endMonth),
                        },
                    },
                },
            },
        },
        include: {
            log: {
                include: {
                    months: true,
                },
            },
        },
    });


    let condensedControllers = controllers.map(controller => {
        const totalHours = controller.log?.months.reduce((sum, month) => sum + month.deliveryHours + month.groundHours + month.towerHours + month.approachHours + month.centerHours, 0);
        return {
            controller: controller as User,
            totalHours: totalHours || 0,
        };
    });

    condensedControllers = condensedControllers.filter(data => {
        return data.totalHours < parseInt(maxHours);
    });

    const session = await getServerSession(authOptions);

    return session?.user && (
        <Card>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" sx={{
                    p: 2,
                    border: 4,
                    borderColor: 'red',
                    borderRadius: '8px',
                }}>Roster Purge Assistant</Typography>
                <RosterPurgeSelectionForm startMonth={parseInt(startMonth)} endMonth={parseInt(endMonth)}
                                          maxHours={parseInt(maxHours)} year={parseInt(year)}/>
                <PurgeAssistantTable controllers={condensedControllers} user={session.user}/>
            </CardContent>
        </Card>
    );

}