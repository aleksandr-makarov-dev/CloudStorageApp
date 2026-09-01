import type { ComponentProps } from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "../lib/cn";

export function MenuRoot<Payload>({
  children,
  ...props
}: ComponentProps<typeof BaseMenu.Root<Payload>>) {
  return <BaseMenu.Root {...props}>{children}</BaseMenu.Root>;
}

export function MenuContent({
  children,
  ...props
}: ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className="outline-hidden"
        sideOffset={8}
        align="start"
      >
        <BaseMenu.Popup
          {...props}
          className={cn(
            "relative origin-(--transform-origin) border border-neutral-950 bg-white py-1 text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none",
            props.className,
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuItem({
  className,
  ...props
}: ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      {...props}
      className={cn(
        "flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:bg-neutral-950 data-highlighted:before:content-[''] data-disabled:text-neutral-500 dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white dark:data-disabled:text-neutral-400",
        className,
      )}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      {...props}
      className={cn("mx-1 my-1 h-px bg-neutral-950 dark:bg-white", className)}
    />
  );
}

export function MenuTrigger<Payload>({
  className,
  ...props
}: ComponentProps<typeof BaseMenu.Trigger<Payload>>) {
  return (
    <BaseMenu.Trigger
      {...props}
      className={cn(
        "flex h-8 items-center justify-center gap-1.5 rounded-none border border-neutral-950 bg-white pl-3 pr-2 text-sm leading-none whitespace-nowrap font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 data-pressed:bg-neutral-100 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700 data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:data-pressed:bg-neutral-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
        className,
      )}
    />
  );
}

export function EllipsisHorizontalIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <circle cx="3" cy="8" r="1" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="13" cy="8" r="1" />
    </svg>
  );
}

export function createMenuHandle<Payload>() {
  return BaseMenu.createHandle<Payload>();
}

export type MenuHandle<Payload = unknown> = ReturnType<
  typeof createMenuHandle<Payload>
>;
