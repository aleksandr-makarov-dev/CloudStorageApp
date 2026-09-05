import {
  MenuContent,
  MenuItem,
  MenuRoot,
  type MenuHandle,
} from "@/shared/ui/menu";
import type { Resource } from "../types";
import { useTranslation } from "react-i18next";

type TrashActionMenuProps = {
  handle: MenuHandle<Resource>;
  onRestoreResourceClick: (resource: Resource) => void;
};

export function TrashActionMenu({
  handle,
  onRestoreResourceClick,
}: TrashActionMenuProps) {
  const { t } = useTranslation("resources");

  return (
    <MenuRoot handle={handle}>
      {({ payload }) => {
        if (!payload) return null;

        return (
          <MenuContent>
            <MenuItem onClick={() => onRestoreResourceClick(payload)}>
              {t("TrashActionMenu.Restore")}
            </MenuItem>
          </MenuContent>
        );
      }}
    </MenuRoot>
  );
}
