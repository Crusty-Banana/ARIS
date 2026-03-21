import Form from "next/form";
import { httpPost$OCRUpload } from "@/modules/commands/UploadOCRResult/fetcher";
export default function ServerUpload() {
  const handleUserSubmit = async (data: FormData) => {
    const userinput = data.get("userinput") as string;
    console.log(userinput);
    try {
      const res = await httpPost$OCRUpload("/api/ocr", userinput);

      if (res.success) {
        console.log("Success", res.message);
      } else {
        console.log("failed", res.message);
      }
    } catch (error) {
      console.error("unexpected", error);
    } finally {
      console.log("done");
    }
  };
  return (
    <Form action={handleUserSubmit}>
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <input name="userinput" />
      <button type="submit">Submit</button>
    </Form>
  );
}
