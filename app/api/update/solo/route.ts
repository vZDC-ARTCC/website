import {deleteExpiredSolos} from "@/actions/solo";
import {revalidatePath} from "next/cache";
import {updateSyncTime} from "@/actions/lib/sync";

export const dynamic = 'force-dynamic';

export async function GET() {

    await deleteExpiredSolos();

    await updateSyncTime({soloCert: new Date()});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}