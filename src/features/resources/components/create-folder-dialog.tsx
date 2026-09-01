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
import { CreateFolderForm } from "./create-folder-form";
import { useCreateFolder } from "../hooks/mutations";
import type { CreateFolderRequest } from "../types";
import { useToastManager } from "@/shared/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { listResourcesQueryOptions } from "../hooks/queries";
import { ApiError } from "@/shared/api/api-error";

type CreateFolderDialogProps = {
  handle: DialogHandle;
};

const formId = "CREATE_FOLDER_FORM";

export function CreateFolderDialog({ handle }: CreateFolderDialogProps) {
  const toastManager = useToastManager();
  const queryClient = useQueryClient();
  const createFolder = useCreateFolder();

  async function handleSubmit(data: CreateFolderRequest) {
    try {
      await createFolder.mutateAsync(data);

      queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });

      toastManager.add({
        title: "Folder created",
        description: "The folder was successfully created.",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <CreateFolderForm
          formId={formId}
          defaultValues={{ name: "" }}
          onSubmit={handleSubmit}
        />
        <DialogFooter>
          <Button form={formId} type="submit">
            Create
          </Button>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
