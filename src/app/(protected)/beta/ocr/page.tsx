// import TempImageUploader from "./_components/fileinput/TempImageUploader";
// export default function OCR() {
//   return (<TempImageUploader></TempImageUploader>);
// }
"use client";
import { ChangeEvent, useState } from "react";
import TempImageUploader from "./_components/fileinput/TempImageUploader";

type UploadStatus = "idle" | "uploading" | "success" | "error";
export default function OCR() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [imglink, setImgLink] = useState<string | null>(null);
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImgLink(URL.createObjectURL(selectedFile));
    }
  }

  function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
  }

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange}></input>
      {file && (
        <div className="mb-4 text-sm">
          <p>{file.name}</p>
          <p>{file.size / 1024} kb</p>
          <p>{file.type}</p>
        </div>
      )}
      {imglink && (
        <img
          src={imglink}
          style={{ width: "1000px", height: "auto", borderRadius: "8px" }}
          alt="Preview"
        />
      )}
      <button>submit</button>
    </div>
  );
}
