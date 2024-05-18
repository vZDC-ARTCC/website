import {generateUploadButton} from "@uploadthing/react";
import {fileRouter} from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<typeof fileRouter>();