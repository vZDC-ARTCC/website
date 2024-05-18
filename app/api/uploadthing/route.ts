import {createRouteHandler} from "uploadthing/next";

import {fileRouter} from "./core";
import {UTApi} from "uploadthing/server";

// Export routes for Next App Router
export const {GET, POST} = createRouteHandler({
    router: fileRouter,
});

export async function DELETE(request: Request) {
    const data = await request.json();
    const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
    const utapi = new UTApi();
    await utapi.deleteFiles(newUrl);

    return Response.json({message: "ok"});
}