import Button from "@/shared/ui/button";
import React, { useRef, type ComponentProps } from "react";
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
import { useTranslation } from "react-i18next";

type UploadFileButtonProps = Pick<
  ComponentProps<typeof Button>,
  "children" | "variant" | "className"
>;

export function UploadFileButton(props: UploadFileButtonProps) {
  const { t } = useTranslation("resources");
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
        title: t("UploadFileButton.LoadingTitle"),
        description: t("UploadFileButton.LoadingDescription"),
      },
      success: () => ({
        title: t("UploadFileButton.SuccessTitle"),
        description: t("UploadFileButton.SuccessDescription"),
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
          title: t("UploadFileButton.ErrorTitle"),
          description: t("UploadFileButton.ErrorDescription"),
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
