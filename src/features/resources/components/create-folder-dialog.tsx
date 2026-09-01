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
import { json } from "zod";

type CreateFolderDialogProps = {
  handle: DialogHandle;
};

const formId = "CREATE_FOLDER_FORM";

export function CreateFolderDialog({ handle }: CreateFolderDialogProps) {
  const toastManager = useToastManager();
  const queryClient = useQueryClient();
  const createFolder = useCreateFolder();

  function handleSubmit(data: CreateFolderRequest) {
    createFolder.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: listResourcesQueryOptions().queryKey,
        });

        toastManager.add({
          title: "Folder created",
          description: "The folder was successfully created.",
        });

        handle.close();
      },
      onError: (error) => {
        console.error("CreateFolderDialog:", JSON.stringify(error, null, 2));

        toastManager.add({
          title: error.title,
          description: error.message,
        });
      },
    });
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
