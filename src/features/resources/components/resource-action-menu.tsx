import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  type MenuHandle,
} from "@/shared/ui/menu";
import type { Resource } from "../types";

type ResourceActionMenuProps = {
  handle: MenuHandle<Resource>;
  onUpdateResourceClick: (resource: Resource) => void;
};

export function ResourceActionMenu({
  handle,
  onUpdateResourceClick,
}: ResourceActionMenuProps) {
  return (
    <MenuRoot handle={handle}>
      {({ payload }) => {
        if (!payload) return null;

        return (
          <MenuContent>
            <MenuItem onClick={() => onUpdateResourceClick(payload)}>
              Update
            </MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Move to folder</MenuItem>
            <MenuSeparator />
            <MenuItem>Delete</MenuItem>
          </MenuContent>
        );
      }}
    </MenuRoot>
  );
}
