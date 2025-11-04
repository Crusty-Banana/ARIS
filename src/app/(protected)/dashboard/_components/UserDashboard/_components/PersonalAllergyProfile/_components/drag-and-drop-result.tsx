import clsx from "clsx";
import { UploadCloud } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DragAndDropProps {
  onFilesDropped: (files: File) => void;
}

export function DragAndDrop({ onFilesDropped }: DragAndDropProps) {
  const [isOver, setIsOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesDropped(droppedFiles[0]);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onFilesDropped(Array.from(selectedFiles)[0]);
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={twMerge(
        clsx(
          "relative cursor-pointer rounded-md aspect-video",
          "flex flex-col items-center justify-center text-center",
          "font-medium text-cyan-600 hover:text-cyan-500",
          "border-dashed border-cyan-600 border-2",
          isOver ? "bg-cyan-50" : "bg-white"
        )
      )}
    >
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        multiple={false}
        ref={fileInputRef}
      />
      <UploadCloud className="h-10 w-10 text-cyan-500 mb-2" />
      {/* <span>{t("uploadTestResultFile")}</span> */}
      <span>{"uploadTestResultFile"}</span>
      <p className="text-xs text-gray-500 mt-1">{""}</p>
    </div>
  );
}
