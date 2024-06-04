import {sendTestEmail} from "@/actions/mail";

export async function GET() {
    const res = await sendTestEmail('');
    return Response.json(res);
}