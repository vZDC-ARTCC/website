import {deleteExpiredSolos} from "@/actions/solo";

export default async function GET() {

    await deleteExpiredSolos();

    return Response.json({ok: true,});
}