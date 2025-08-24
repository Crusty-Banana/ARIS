import { uploadFileToS3 } from "@/modules/s3-storage";
import { AddFileToS3$Params } from "./typing";

export async function handler$AddFileToS3(
  params: AddFileToS3$Params
) {
  return await uploadFileToS3(params);
}
