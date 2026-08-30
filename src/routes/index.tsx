import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/input";
import Button from "../components/button";
import { useRef } from "react";
import type { BaseUIEvent } from "@base-ui/react/types";
import { useCreateUploadUrl } from "../hooks/use-create-upload-url";
import { useUploadFile } from "../hooks/use-upload-file";
import { useCompleteUpload } from "../hooks/use-complete-upload";
import {
  listResourcesQueryOptions,
  useListResources,
} from "../hooks/use-list-resources";
import { formatDate } from "../lib/formate-date";
import { formatBytes } from "../lib/format-bytes";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const createUploadUrl = useCreateUploadUrl();
  const uploadFile = useUploadFile();
  const completeUpload = useCompleteUpload();
  const listResources = useListResources();

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

      // refresh listResources query
      //TODO: replace with optimistic update
      queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });
    } catch (error) {
      console.error("file upload failed:", error);
    }
  }

  return (
    <div className="p-2 space-y-4">
      <div>
        <Button onClick={() => inputRef.current?.click()}>Upload file</Button>
        <Input ref={inputRef} type="file" hidden onChange={handleFileChange} />
      </div>
      <div>
        <table className="border-collapse border">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-medium border-y">Name</th>
              <th className="px-3 py-2 text-left font-medium border-y">
                Content Type
              </th>
              <th className="px-3 py-2 text-left font-medium border-y">
                Content Length
              </th>
              <th className="px-3 py-2 text-left font-medium border-y">
                Created At
              </th>
              <th className="px-3 py-2 text-left font-medium border-y">
                Last Modified At
              </th>
            </tr>
          </thead>
          <tbody>
            {listResources.data?.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 border-y text-left">{row.name}</td>
                <td className="px-3 py-2 border-y text-left">
                  {row.contentType}
                </td>
                <td className="px-3 py-2 border-y text-right">
                  {formatBytes(row.contentLength)}
                </td>
                <td className="px-3 py-2 border-y text-left">
                  {formatDate(row.createdAtUtc)}
                </td>
                <td className="px-3 py-2 border-y text-left">
                  {row.lastModifiedAtUtc && formatDate(row.lastModifiedAtUtc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
