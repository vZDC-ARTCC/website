import prisma from "@/lib/db";

export async function GET(request: Request, props: { params: Promise<{ cid: string }> }) {
    const params = await props.params;

    const user = await prisma.user.findUnique({
        where: {
            cid: params.cid,
        },
    });

    return Response.json(user?.roles.includes("STAFF") || false);
}