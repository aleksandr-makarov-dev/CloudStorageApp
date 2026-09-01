import Button from "@/shared/ui/button";
import React, {
  useRef,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import {
  useCompleteUpload,
  useCreateUploadUrl,
  useUploadToBucket,
} from "../hooks/mutations";
import {
  createUploadUrlInputSchema,
  type UploadToBucketParams,
} from "../types";
import { useToastManager } from "@/shared/ui/toast";
import { ApiError } from "@/shared/api/api-error";
import { useQueryClient } from "@tanstack/react-query";
import { listResourcesQueryOptions } from "../hooks/queries";

type UploadFileButtonProps = Pick<
  ComponentProps<typeof Button>,
  "children" | "variant" | "className"
>;

export function UploadFileButton(props: UploadFileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toastManager = useToastManager();
  const queryClient = useQueryClient();
  const createUploadUrl = useCreateUploadUrl();
  const uploadToBucket = useUploadToBucket();
  const completeUpload = useCompleteUpload();

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    if (!e.target.files?.length) {
      console.log("UploadFileButton: file was not selected.");
      return;
    }

    const file = e.target.files[0];

    const promise = (async () => {
      const uploadUrlRequest = createUploadUrlInputSchema.parse({
        name: file.name,
        contentType: file.type,
        contentLength: file.size,
      });

      const uploadUrl = await createUploadUrl.mutateAsync(uploadUrlRequest);

      const uploadToBucketParams = {
        file,
        url: uploadUrl.url,
        formFields: uploadUrl.formFields,
      } satisfies UploadToBucketParams;

      await uploadToBucket.mutateAsync(uploadToBucketParams);

      await completeUpload.mutateAsync(uploadUrl.id);

      await queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });
    })();

    toastManager.promise(promise, {
      loading: {
        title: "Uploading file",
        description: "Please wait while the file is being uploaded.",
      },
      success: () => ({
        title: "File uploaded",
        description: "File was successfully uploaded.",
      }),
      error: (error) => {
        if (error instanceof ApiError) {
          return {
            title: error.title,
            description: error.message,
          };
        }

        console.error("UploadFileButton:", error);

        return {
          title: "Upload failed",
          description: "Something went wrong. Please try again.",
        };
      },
    });
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick} {...props} />
      <input ref={inputRef} hidden type="file" onChange={handleFileChange} />
    </React.Fragment>
  );
}
