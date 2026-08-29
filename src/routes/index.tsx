import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/input";
import Button from "../components/button";
import { useRef } from "react";
import type { BaseUIEvent } from "@base-ui/react/types";
import { useCreateUploadUrl } from "../hooks/use-create-upload-url";
import { useUploadFile } from "../hooks/use-upload-file";
import { useCompleteUpload } from "../hooks/use-complete-upload";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const createUploadUrl = useCreateUploadUrl();
  const uploadFile = useUploadFile();
  const completeUpload = useCompleteUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(
    e: BaseUIEvent<React.ChangeEvent<HTMLInputElement, HTMLInputElement>>,
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      console.log("file not selected");
      return;
    }

    try {
      const { url, formFields, id } = await createUploadUrl.mutateAsync({
        name: file.name,
        contentType: file.type,
        contentLength: file.size,
      });

      await uploadFile.mutateAsync({
        file,
        url,
        formFields,
      });

      await completeUpload.mutateAsync(id);
    } catch (error) {
      console.error("file upload failed:", error);
    }
  }

  return (
    <div className="p-2">
      <Button onClick={() => inputRef.current?.click()}>Upload file</Button>
      <Input ref={inputRef} type="file" hidden onChange={handleFileChange} />
    </div>
  );
}
