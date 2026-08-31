import {
  useCreateUploadUrl,
  useCompleteUpload,
  useUpdateResource,
  useUploadToBucket,
} from "@/features/resources/hooks/mutations";
import {
  useListResources,
  listResourcesQueryOptions,
} from "@/features/resources/hooks/queries";
import type { Resource } from "@/features/resources/types";
import { ApiError } from "@/shared/api/api-error";
import { formatBytes } from "@/shared/lib/format-bytes";
import { formatDate } from "@/shared/lib/format-date";
import Button from "@/shared/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";
import { Field } from "@/shared/ui/field";
import { Form } from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import {
  EllipsisHorizontalIcon,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/shared/ui/menu";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@/shared/ui/table";
import {
  type BaseUIEvent,
  Menu as BaseMenu,
  Dialog as BaseDialog,
} from "@base-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React, { useRef } from "react";
import z from "zod";

export const Route = createFileRoute("/")({
  component: Index,
});

const actionMenuHandle = BaseMenu.createHandle<Resource>();
const dialogHandle = BaseDialog.createHandle<Resource>();

const schema = z.object({
  id: z.string().min(1).max(36),
  name: z.string().min(1).max(128),
});

const formId = "UPDATE_RESOURCE_FORM";

function Index() {
  const queryClient = useQueryClient();
  const createUploadUrl = useCreateUploadUrl();
  const uploadFile = useUploadToBucket();
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
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        console.error("file upload failed:", {
          status: error.status,
          title: error.title,
          detail: error.detail,
          traceId: error.traceId,
          problemDetails: error.problemDetails,
        });
        // Optionally show a toast with error.detail ?? error.title
      } else {
        console.error("file upload failed (unknown):", error);
      }
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
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        console.error("failed to update resource:", {
          status: error.status,
          title: error.title,
          detail: error.detail,
          traceId: error.traceId,
        });
        // You can also surface this in the form (e.g. setError) if desired
      } else {
        console.error("failed to update resource (unknown):", error);
      }
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
