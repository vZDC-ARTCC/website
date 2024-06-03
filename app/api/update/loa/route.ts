import {deleteExpiredLoas} from "@/actions/loa";

export default async function GET() {

    await deleteExpiredLoas();

    return Response.json({ok: true,});
}