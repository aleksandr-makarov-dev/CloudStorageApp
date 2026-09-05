import { TrashActionMenu } from "@/features/resources/components/trash-action-menu";
import { useListTrash } from "@/features/resources/hooks/queries";
import type { Resource } from "@/features/resources/types";
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
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/drive/trash")({
  component: RouteComponent,
});

const menuActionHandle = createMenuHandle<Resource>();

function RouteComponent() {
  const { t } = useTranslation("resources");
  const trash = useListTrash();

  return (
    <div className="space-y-3 w-full">
      <h5 className="font-medium text-2xl">{t("Trash")}</h5>
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
          {trash.isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("ResourceTable.LoadingResources")}
              </TableCell>
            </TableRow>
          )}

          {trash.isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {trash.error.message}
              </TableCell>
            </TableRow>
          )}

          {trash.data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {row.isFolder ? (
                  <Link
                    className="font-medium"
                    to="/drive"
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
      <TrashActionMenu
        handle={menuActionHandle}
        onRestoreResourceClick={(resource) => {}}
      />
    </div>
  );
}
