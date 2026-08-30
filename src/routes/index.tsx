import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { useRef, useState } from "react";
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
} from "../components/ui/dialog";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useUpdateResource } from "../hooks/use-update-resource";
import z from "zod";
import { Form } from "../components/ui/form";
import { Field } from "../components/ui/field";
import type { ResourceResponse } from "../models/resource-response";

export const Route = createFileRoute("/")({
  component: Index,
});

const actionMenuHandle = BaseMenu.createHandle<ResourceResponse>();
const dialogHandle = BaseDialog.createHandle<ResourceResponse>();

const schema = z.object({
  id: z.string().min(1).max(36),
  name: z.string().min(1).max(128),
});

const formId = "UPDATE_RESOURCE_FORM";

function Index() {
  const queryClient = useQueryClient();
  const createUploadUrl = useCreateUploadUrl();
  const uploadFile = useUploadFile();
  const completeUpload = useCompleteUpload();
  const listResources = useListResources();
  const updateResource = useUpdateResource();

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
    } catch (e) {
      console.error("file upload failed:", JSON.stringify(e, null, 2));
    }
  }

  async function handleUpdateResource(data: z.infer<typeof schema>) {
    try {
      await updateResource.mutateAsync({
        id: data.id,
        request: { name: data.name },
      });

      queryClient.invalidateQueries({
        queryKey: listResourcesQueryOptions().queryKey,
      });

      dialogHandle.close();
    } catch (e) {
      console.log("failed to update resource", JSON.stringify(e, null, 2));
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
                  payload={row}
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
            <MenuItem onClick={() => dialogHandle.openWithPayload(payload!)}>
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
      <DialogRoot handle={dialogHandle} disablePointerDismissal>
        {({ payload }) => (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update resource</DialogTitle>
              <DialogDescription>
                Specify a new name for the resource and save the changes.
              </DialogDescription>
            </DialogHeader>
            <Form
              id={formId}
              schema={schema}
              onSubmit={handleUpdateResource}
              options={{
                defaultValues: {
                  id: payload?.id,
                  name: payload?.name,
                },
              }}
            >
              {({ control }) => (
                <React.Fragment>
                  <Field
                    label="Name"
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input className="w-full" {...field} />
                    )}
                  />
                </React.Fragment>
              )}
            </Form>
            <DialogFooter>
              <Button form={formId} type="submit">
                Save changes
              </Button>
              <DialogClose>Cancel</DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </DialogRoot>
    </div>
  );
}
