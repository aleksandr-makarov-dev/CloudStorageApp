import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  type MenuHandle,
} from "@/shared/ui/menu";
import type { Resource } from "../types";
import { useTranslation } from "react-i18next";

type ResourceActionMenuProps = {
  handle: MenuHandle<Resource>;
  onUpdateResourceClick: (resource: Resource) => void;
};

export function ResourceActionMenu({
  handle,
  onUpdateResourceClick,
}: ResourceActionMenuProps) {
  const { t } = useTranslation("resources");

  return (
    <MenuRoot handle={handle}>
      {({ payload }) => {
        if (!payload) return null;

        return (
          <MenuContent>
            <MenuItem onClick={() => onUpdateResourceClick(payload)}>
              {t("ResourceActionMenu.Rename")}
            </MenuItem>
            <MenuItem>{t("ResourceActionMenu.Copy")}</MenuItem>
            <MenuItem>{t("ResourceActionMenu.Move")}</MenuItem>
            <MenuSeparator />
            <MenuItem>{t("ResourceActionMenu.Delete")}</MenuItem>
          </MenuContent>
        );
      }}
    </MenuRoot>
  );
}
