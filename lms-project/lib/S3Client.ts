import "server-only";

import {S3Client} from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { fa } from "zod/v4/locales";

export const S3 = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: false,
});