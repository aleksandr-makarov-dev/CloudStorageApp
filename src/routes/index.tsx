import { ResourceTable } from "@/features/resources/components/resource-table";
import Button from "@/shared/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation("resources");

  return (
    <div className="p-4 flex flex-row gap-3">
      <div className="w-64 border p-2 space-y-2">
        <Button className="w-full" variant="secondary">
          {t("Sidebar.MyDrive")}
        </Button>
        <Button className="w-full" variant="secondary">
          {t("Sidebar.Trash")}
        </Button>
      </div>
      <ResourceTable />
    </div>
  );
}
