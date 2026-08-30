import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type TableProps = ComponentProps<"table">;

export function Table({ className, ...props }: TableProps) {
  return (
    <table {...props} className={cn("border-collapse border", className)} />
  );
}

type TableHeadProps = ComponentProps<"thead">;

export function TableHead({ className, ...props }: TableHeadProps) {
  return <thead {...props} className={cn(className)} />;
}

type TableBodyProps = ComponentProps<"tbody">;

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody {...props} className={cn(className)} />;
}

type TableRowProps = ComponentProps<"tr">;

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr {...props} className={cn(className)} />;
}

type TableHeaderCellProps = ComponentProps<"th">;

export function TableHeaderCell({ className, ...props }: TableHeaderCellProps) {
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

type TableCellProps = ComponentProps<"td">;

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td {...props} className={cn("text-sm px-3 py-2 border-y", className)} />
  );
}
