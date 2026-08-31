import Button from "@/shared/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  type DialogHanle,
} from "@/shared/ui/dialog";
import { type Resource, type UpdateResourceRequest } from "../types";
import { UpdateResourceForm } from "./update-resource-form";
import { useUpdateResource } from "../hooks/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { listResourcesQueryOptions } from "../hooks/queries";

type UpdateResourceDialogProps = {
  handle: DialogHanle<Resource>;
};

const formId = "UPDATE_RESOURCE_FORM";

export function UpdateResourceDialog({ handle }: UpdateResourceDialogProps) {
  const queryClient = useQueryClient();
  const updateResource = useUpdateResource();

  async function handleSumit(id: string, data: UpdateResourceRequest) {
    try {
      await updateResource.mutateAsync({
        id: id,
        request: data,
      });

      // TODO: do I need to provide params to query options?
      queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });

      handle.close();
    } catch (e) {
      console.log("UpdateResourceDialog error:", JSON.stringify(e, null, 2));
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
              onSubmit={(data) => handleSumit(payload.id, data)}
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
