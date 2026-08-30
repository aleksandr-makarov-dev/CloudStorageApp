import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../components/ui/table";
import {
  EllipsisHorizontalIcon,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "../components/ui/menu";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";

export const Route = createFileRoute("/")({
  component: Index,
});

const actionMenuHandle = BaseMenu.createHandle<{ id: string }>();
const dialogHandle = BaseDialog.createHandle();

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
    <div className="p-4 space-y-3">
      <div>
        <Button onClick={() => inputRef.current?.click()}>Upload file</Button>
        <Input ref={inputRef} type="file" hidden onChange={handleFileChange} />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Content Type</TableHeaderCell>
            <TableHeaderCell>Content Length</TableHeaderCell>
            <TableHeaderCell>Created At</TableHeaderCell>
            <TableHeaderCell>Last Modified At</TableHeaderCell>
            <TableHeaderCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {listResources.data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.contentType}</TableCell>
              <TableCell className="text-right">
                {formatBytes(row.contentLength)}
              </TableCell>
              <TableCell>{formatDate(row.createdAtUtc)}</TableCell>
              <TableCell>
                {row.lastModifiedAtUtc && formatDate(row.lastModifiedAtUtc)}
              </TableCell>
              <TableCell>
                <MenuTrigger
                  className="size-8 border-0 p-0"
                  handle={actionMenuHandle}
                  payload={{ id: row.id }}
                >
                  <EllipsisHorizontalIcon className="size-4" />
                </MenuTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MenuRoot handle={actionMenuHandle}>
        {({ payload }) => (
          <MenuContent>
            <MenuItem onClick={() => dialogHandle.open("rename")}>
              Rename
            </MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Move to folder</MenuItem>
            <MenuSeparator />
            <MenuItem
              onClick={() =>
                confirm(
                  `Are you sure you want to delete ${payload?.id}? This action can't be undone`,
                )
              }
            >
              Delete
            </MenuItem>
          </MenuContent>
        )}
      </MenuRoot>
      <DialogRoot handle={dialogHandle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              This is very important notification...
            </DialogDescription>
          </DialogHeader>
          <div>Hello world!</div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
