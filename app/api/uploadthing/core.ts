import {createUploadthing, FileRouter} from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {

    eventBannerUploader: f({image: {maxFileSize: "4MB"}})
        .onUploadComplete(async ({file, metadata}) => {
            return {url: file.url};
        })

} satisfies FileRouter;