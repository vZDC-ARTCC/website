import {NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import VatsimProvider from "@/auth/vatsimProvider";
import {Adapter} from "next-auth/adapters";
import prisma from "@/lib/db";


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

            session.user = user;
            return session;
        }

    }
}