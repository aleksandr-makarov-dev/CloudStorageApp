import { formatBytes } from "@/shared/lib/format-bytes";
import { formatDate } from "@/shared/lib/format-date";
import {
  createMenuHandle,
  EllipsisHorizontalIcon,
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
import type { Resource } from "../types";
import React from "react";
import { ResourceActionMenu } from "./resource-action-menu";
import { UpdateResourceDialog } from "./update-resource-dialog";
import { createDialogHandle } from "@/shared/ui/dialog";
import { useListResources } from "../hooks/queries";
import Button from "@/shared/ui/button";
import { CreateFolderDialog } from "./create-folder-dialog";
import { UploadFileButton } from "./upload-file-button";

const menuActionHandle = createMenuHandle<Resource>();
const updateResourceDialogHandle = createDialogHandle<Resource>();
const createFolderDialogHandle = createDialogHandle();

export function ResourceTable() {
  const listResources = useListResources();

  return (
    <React.Fragment>
      <div className="flex flex-row gap-x-3">
        <UploadFileButton variant="primary">Upload File</UploadFileButton>
        <Button
          variant="secondary"
          onClick={() => createFolderDialogHandle.open(null)}
        >
          Create Folder
        </Button>
      </div>
      <Table className="w-full max-w-7xl">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Content Type</TableHeaderCell>
            <TableHeaderCell>Content Length</TableHeaderCell>
            <TableHeaderCell>Created At</TableHeaderCell>
            <TableHeaderCell>Last Modified At</TableHeaderCell>
            <TableHeaderCell className="w-14" />
          </TableRow>
        </TableHead>
        <TableBody>
          {listResources.isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading resources...
              </TableCell>
            </TableRow>
          )}
          {listResources.isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {listResources.error.message}
              </TableCell>
            </TableRow>
          )}
          {listResources.data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.isFolder ? "Folder" : "File"}</TableCell>
              <TableCell>{row.contentType}</TableCell>
              <TableCell className="text-right">
                {row.contentLength && formatBytes(row.contentLength)}
              </TableCell>
              <TableCell>{formatDate(row.createdAtUtc)}</TableCell>
              <TableCell>
                {row.lastModifiedAtUtc && formatDate(row.lastModifiedAtUtc)}
              </TableCell>
              <TableCell className="w-14">
                <MenuTrigger
                  className="size-8 border-0 p-0"
                  handle={menuActionHandle}
                  payload={row}
                >
                  <EllipsisHorizontalIcon className="size-4" />
                </MenuTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ResourceActionMenu
        handle={menuActionHandle}
        onUpdateResourceClick={(resource) =>
          updateResourceDialogHandle.openWithPayload(resource)
        }
      />
      <UpdateResourceDialog handle={updateResourceDialogHandle} />
      <CreateFolderDialog handle={createFolderDialogHandle} />
    </React.Fragment>
  );
}
