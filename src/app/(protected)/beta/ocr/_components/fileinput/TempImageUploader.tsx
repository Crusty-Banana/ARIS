"use client";
import { ChangeEvent, useState } from "react";

interface OCRFunctionProp {
  onSubmit: () => void;
}
export default function OCRupload({ onSubmit }: OCRFunctionProp) {
  const [file, setFile] = useState<File | null>(null);
  const [imglink, setImgLink] = useState<string | null>(null);
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImgLink(URL.createObjectURL(selectedFile));
    }
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
      <button onClick={onSubmit}>submit</button>
    </div>
  );
}
