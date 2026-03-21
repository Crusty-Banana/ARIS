"use client";
import { useState } from "react";
import OCRupload from "./_components/fileinput/TempImageUploader";
import ResultDisplay from "./_components/result/OCRResult";
import ServerUpload from "./_components/savetoserver/ServerSave";
export default function OCR() {
  const [submited, setSubmited] = useState(false);
  const handleSubmit = () => {
    setSubmited(true);
    console.log("asdfasdfasdf");
  };
  return (
    <div>
      <OCRupload onSubmit={handleSubmit}></OCRupload>
      {submited && <ResultDisplay></ResultDisplay>}
      <ServerUpload></ServerUpload>
    </div>
  );
}
