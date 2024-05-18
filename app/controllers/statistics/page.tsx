import {permanentRedirect, RedirectType} from "next/navigation";

export default async function Page() {

    const year = new Date().getFullYear().toString();
    const month = new Date().getMonth().toString();

    permanentRedirect(`/controllers/statistics/${year}/${month}`, RedirectType.replace);
}