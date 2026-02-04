import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as s3Service from "../services/s3.service.js";

// POST /api/s3/upload - Generate presigned upload URL
export async function generateUploadUrl(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const result = await s3Service.generateUploadUrl(req.body);

    if (result.error) {
      return res.status(400).json({
        status: "error",
        message: result.error,
      });
    }

    res.json({
      status: "success",
      message: "Upload URL generated",
      data: { url: result.url, key: result.key },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}

// DELETE /api/s3/delete - Delete file from S3
export async function deleteFile(req: AuthenticatedRequest, res: Response) {
  try {
    const { key } = req.body;
    const result = await s3Service.deleteFile(key);

    if (result.error) {
      return res.status(400).json({
        status: "error",
        message: result.error,
      });
    }

    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}
