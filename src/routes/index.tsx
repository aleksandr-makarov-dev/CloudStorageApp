import { ResourceTable } from "@/features/resources/components/resource-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-4 space-y-3">
      <ResourceTable />
    </div>
  );
}
