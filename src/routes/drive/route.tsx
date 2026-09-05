import Button from "@/shared/ui/button";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/drive")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation("resources");
  const navigate = Route.useNavigate();

  return (
    <div className="p-4 flex flex-row gap-3">
      <div className="w-64 border p-2 space-y-2 shrink-0">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => navigate({ to: "/drive" })}
        >
          {t("Sidebar.MyDrive")}
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => navigate({ to: "/drive/trash" })}
        >
          {t("Sidebar.Trash")}
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
