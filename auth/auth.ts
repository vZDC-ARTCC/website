import {NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import VatsimProvider from "@/auth/vatsimProvider";
import {Adapter} from "next-auth/adapters";
import prisma from "@/lib/db";
import {getRating} from "@/lib/vatsim";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        VatsimProvider(
            process.env['VATSIM_CLIENT_ID'],
            process.env['VATSIM_CLIENT_SECRET'],
        ),
    ],
    theme: {
        logo: '/img/logo.png',
    },
    callbacks: {
        session: async ({session, user}) => {

            if (!user.flagAutoAssignSinglePass && user.controllerStatus === 'HOME' && getRating(user.rating) === 'OBS') {
                const newHomeObsProgression = await prisma.trainingProgression.findFirst({
                    where: {
                        autoAssignNewHomeObs: true,
                    },
                });

                if (newHomeObsProgression) {
                    await prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            trainingProgressionId: newHomeObsProgression.id,
                        },
                    });
                }
            } else if (!user.flagAutoAssignSinglePass) {
                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        flagAutoAssignSinglePass: true,
                    },
                });
            }

            session.user = user;
            return session;
        }
    }
}