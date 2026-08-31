import type { ComponentProps } from "react";
import { cn } from "../../shared/lib/cn";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table {...props} className={cn("border-collapse border", className)} />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"thead">) {
  return <thead {...props} className={cn("bg-neutral-100", className)} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody {...props} className={cn(className)} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr {...props} className={cn(className)} />;
}

export function TableHeaderCell({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      {...props}
      scope="col"
      className={cn(
        "text-sm px-3 py-2 text-left font-medium border-y",
        className,
      )}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td {...props} className={cn("text-sm px-3 py-2 border-y", className)} />
  );
}
