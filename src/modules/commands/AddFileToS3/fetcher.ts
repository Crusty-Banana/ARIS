import { AddFileToS3$Result } from "./typing";

export async function httpPost$AddFileToS3(url: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = AddFileToS3$Result.parse({
    success: response.ok,
    ...data,
  });
  return result;
}
