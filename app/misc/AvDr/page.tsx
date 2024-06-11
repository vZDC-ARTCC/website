import {Roboto} from "next/font/google";

const headingFont = Roboto({subsets: ['latin'], weight: '400',});

export default async function Page() {

    return (
        <h1>No this is NOT the real world ZDC</h1>
    );
}
