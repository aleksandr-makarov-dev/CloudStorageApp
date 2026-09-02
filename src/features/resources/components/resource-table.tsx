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
import { ResourceActionMenu } from "./resource-action-menu";
import { UpdateResourceDialog } from "./update-resource-dialog";
import { createDialogHandle } from "@/shared/ui/dialog";
import { useListResources } from "../hooks/queries";
import Button from "@/shared/ui/button";
import { CreateFolderDialog } from "./create-folder-dialog";
import { UploadFileButton } from "./upload-file-button";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

const menuActionHandle = createMenuHandle<Resource>();
const updateResourceDialogHandle = createDialogHandle<Resource>();
const createFolderDialogHandle = createDialogHandle();

type ResourceTableProps = {
  parentId?: string;
};

export function ResourceTable({ parentId }: ResourceTableProps) {
  const { t } = useTranslation("resources");
  const listResources = useListResources({
    query: {
      parentId: parentId,
    },
  });

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-row gap-x-3">
        <UploadFileButton variant="primary" parentId={parentId}>
          {t("ResourceTable.UploadFile")}
        </UploadFileButton>

        <Button
          variant="secondary"
          onClick={() => createFolderDialogHandle.open(null)}
        >
          {t("ResourceTable.CreateFolder")}
        </Button>
      </div>

      <Table className="w-full max-w-7xl">
        <TableHead>
          <TableRow>
            <TableHeaderCell>{t("ResourceTable.Name")}</TableHeaderCell>
            <TableHeaderCell>{t("ResourceTable.Type")}</TableHeaderCell>
            <TableHeaderCell>{t("ResourceTable.ContentType")}</TableHeaderCell>
            <TableHeaderCell>
              {t("ResourceTable.ContentLength")}
            </TableHeaderCell>
            <TableHeaderCell>{t("ResourceTable.CreatedAt")}</TableHeaderCell>
            <TableHeaderCell>
              {t("ResourceTable.LastModifiedAt")}
            </TableHeaderCell>
            <TableHeaderCell className="w-14" />
          </TableRow>
        </TableHead>

        <TableBody>
          {listResources.isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("ResourceTable.LoadingResources")}
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
              <TableCell>
                {row.isFolder ? (
                  <Link
                    className="font-medium"
                    to="/"
                    search={{ parentId: row.id }}
                  >
                    {row.name}
                  </Link>
                ) : (
                  row.name
                )}
              </TableCell>

              <TableCell>
                {row.isFolder
                  ? t("ResourceTable.Folder")
                  : t("ResourceTable.File")}
              </TableCell>

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
      <CreateFolderDialog
        handle={createFolderDialogHandle}
        parentId={parentId}
      />
    </div>
  );
}
