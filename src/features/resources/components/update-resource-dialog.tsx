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
import { ApiError } from "@/shared/api/api-error";
import { listResourcesQueryOptions } from "../hooks/queries";

type UpdateResourceDialogProps = {
  handle: DialogHandle<Resource>;
};

const formId = "UPDATE_RESOURCE_FORM";

export function UpdateResourceDialog({ handle }: UpdateResourceDialogProps) {
  const toastManager = useToastManager();
  const queryClient = useQueryClient();
  const updateResource = useUpdateResource();

  async function handleSubmit(id: string, data: UpdateResourceRequest) {
    try {
      await updateResource.mutateAsync({
        id,
        request: data,
      });

      queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });

      toastManager.add({
        title: "Resource updated",
        description: "The resource was successfully updated.",
      });

      handle.close();
    } catch (error) {
      if (error instanceof ApiError) {
        toastManager.add({
          title: error.title,
          description: error.message,
        });
      } else {
        console.error("UpdateResourceDialog error:", error);

        toastManager.add({
          title: "Failed to update resource",
          description: "Something went wrong. Please try again.",
        });
      }
    }
  }

  return (
    <DialogRoot handle={handle}>
      {({ payload }) => {
        if (!payload) return null;

        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update resource</DialogTitle>
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
                {updateResource.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <DialogClose>Cancel</DialogClose>
            </DialogFooter>
          </DialogContent>
        );
      }}
    </DialogRoot>
  );
}
