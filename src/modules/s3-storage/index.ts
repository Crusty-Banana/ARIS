import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SERVER_ENV } from "@/modules/env/server";
import { AddFileToS3$Params } from "../commands/AddFileToS3/typing";

export const s3Client = new S3Client({
  region: SERVER_ENV.AWS_REGION,
  credentials: {
    accessKeyId: SERVER_ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: SERVER_ENV.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileToS3(
  { file, fileName, contentType }:
    AddFileToS3$Params
) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
    ACL: "public-read" as ObjectCannedACL,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return {
    result: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${params.Key}`
  };
}
