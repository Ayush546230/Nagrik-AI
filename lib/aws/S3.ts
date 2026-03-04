import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


// ── S3 Client ──
export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const UPLOAD_EXPIRY = 300;   // 5 minutes
const READ_EXPIRY = 3600;    // 1 hour
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


// KEY GENERATOR

export function generateS3Key(
  userId: string,
  type: "before" | "after",
  fileType: string
): string {
  const ext = fileType.split("/")[1].replace("jpeg", "jpg");
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID();
  return `${type}-photos/${year}/${month}/${userId}-${id}.${ext}`;
}


// GENERATE PRE-SIGNED UPLOAD URL

export interface PresignedPostData {
  url: string;
  fields: Record<string, string>;
  s3Key: string;
}

export async function getPresignedUploadUrl(
  userId: string,
  type: "before" | "after",
  fileType: string,
  fileSize: number
): Promise<PresignedPostData> {
  if (!ALLOWED_TYPES.includes(fileType)) {
    throw new Error(`Invalid file type. Allowed: jpeg, png, webp`);
  }
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max size: 10MB`);
  }

  const s3Key = generateS3Key(userId, type, fileType);

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: BUCKET,
    Key: s3Key,
    Conditions: [
      ["content-length-range", 1, MAX_FILE_SIZE],
      ["eq", "$Content-Type", fileType],
    ],
    Fields: { "Content-Type": fileType },
    Expires: UPLOAD_EXPIRY,
  });

  return { url, fields, s3Key };
}


// GENERATE PRE-SIGNED READ URL


export async function getPresignedReadUrl(s3Key: string): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }),
    { expiresIn: READ_EXPIRY }
  );
}
// DELETE OBJECT (spam cleanup)

export async function deleteS3Object(s3Key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));
}