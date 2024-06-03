const VATUSA_API = 'https://api.vatusa.net/v2';
const VATUSA_KEY = process.env.VATUSA_API_KEY;

export async function GET() {

    const res = await fetch(`${VATUSA_API}/user/1621075/training/records?apiKey=${VATUSA_KEY}`, {
        headers: {
            'Authorization': `Bearer ${VATUSA_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    console.log(res.url);

    return Response.json(await res.json());
}