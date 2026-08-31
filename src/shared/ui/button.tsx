import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "flex h-8 items-center justify-center gap-2 rounded-none border px-3 text-sm leading-none whitespace-nowrap font-normal select-none focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500",
  {
    variants: {
      variant: {
        primary:
          "border-neutral-950 bg-neutral-950 text-white hover:not-data-disabled:bg-neutral-800 active:not-data-disabled:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:not-data-disabled:bg-neutral-200 dark:active:not-data-disabled:bg-neutral-300",
        secondary:
          "border-neutral-950 bg-white text-neutral-950 hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonProps = ComponentProps<typeof BaseButton> &
  VariantProps<typeof buttonVariants>;

export default function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
