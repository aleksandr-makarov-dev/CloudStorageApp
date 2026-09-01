import Button from "@/shared/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  type DialogHandle,
} from "@/shared/ui/dialog";
import { type Resource, type UpdateResourceRequest } from "../types";
import { UpdateResourceForm } from "./update-resource-form";
import { useUpdateResource } from "../hooks/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useToastManager } from "@/shared/ui/toast";
import { listResourcesQueryOptions } from "../hooks/queries";
import { useTranslation } from "react-i18next";

type UpdateResourceDialogProps = {
  handle: DialogHandle<Resource>;
};

const formId = "UPDATE_RESOURCE_FORM";

export function UpdateResourceDialog({ handle }: UpdateResourceDialogProps) {
  const { t } = useTranslation("resources");

  const toastManager = useToastManager();
  const queryClient = useQueryClient();
  const updateResource = useUpdateResource();

  async function handleSubmit(id: string, data: UpdateResourceRequest) {
    updateResource.mutate(
      { id, request: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: listResourcesQueryOptions().queryKey,
          });

          toastManager.add({
            title: t("UpdateResourceDialog.SuccessTitle"),
            description: t("UpdateResourceDialog.SuccessDescription"),
          });

          handle.close();
        },
        onError: (error) => {
          console.error(
            "UpdateResourceDialog:",
            JSON.stringify(error, null, 2),
          );

          toastManager.add({
            title: error.title,
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <DialogRoot handle={handle}>
      {({ payload }) => {
        if (!payload) return null;

        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("UpdateResourceDialog.Title")}</DialogTitle>
            </DialogHeader>

            <UpdateResourceForm
              formId={formId}
              defaultValues={{ name: payload.name }}
              onSubmit={(data) => handleSubmit(payload.id, data)}
            />

            <DialogFooter>
              <Button
                type="submit"
                form={formId}
                disabled={updateResource.isPending}
              >
                {updateResource.isPending
                  ? t("UpdateResourceDialog.Saving")
                  : t("UpdateResourceDialog.SaveChanges")}
              </Button>

              <DialogClose>{t("UpdateResourceDialog.Cancel")}</DialogClose>
            </DialogFooter>
          </DialogContent>
        );
      }}
    </DialogRoot>
  );
}
