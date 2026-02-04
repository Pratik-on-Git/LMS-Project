import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../config/s3.js";
import { env } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

// Generate presigned upload URL
export async function generateUploadUrl(body: unknown) {
  const validation = fileUploadSchema.safeParse(body);

  if (!validation.success) {
    return { error: "Invalid request body" };
  }

  const { fileName, contentType } = validation.data;

  const uniqueKey = `${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    ContentType: contentType,
    Key: uniqueKey,
    ChecksumAlgorithm: undefined,
  });

  const presignedUrl = await getSignedUrl(S3, command, {
    expiresIn: 3600,
    signableHeaders: new Set(["host", "content-type"]),
  });

  return {
    url: presignedUrl,
    key: uniqueKey,
  };
}

// Delete file from S3
export async function deleteFile(key: string) {
  if (!key) {
    return { error: "Missing or Invalid Object Key" };
  }

  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  await S3.send(command);

  return { message: "File deleted successfully" };
}
