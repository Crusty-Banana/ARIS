import { OCRUserinput$input } from "@/modules/commands/UploadOCRResult/typing";
import { Db } from "mongodb";
import { NextResponse } from "next/server";
export async function handler$OCRUpload(db: Db, params: OCRUserinput$input) {
  const userinput = params;
  const collection = db.collection("OCR_text_result");
  const result = await collection.insertOne({
    content: userinput,
    timestamp: new Date(),
  });
  console.log(result);
  return NextResponse.json(
    {
      message: "Saved",
      id: result.insertedId,
    },
    { status: 201 }
  );
}
