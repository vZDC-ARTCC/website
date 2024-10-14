import prisma from "@/lib/db";

export async function GET(request: Request, {params}: { params: { cid: string } }) {

    const user = await prisma.user.findUnique({
        where: {
            cid: params.cid,
        },
    });

    return Response.json(user?.roles.includes("STAFF") || false);

}