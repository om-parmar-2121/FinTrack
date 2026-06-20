import type { FC, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Table: FC<HTMLAttributes<HTMLTableElement>> = ({ children, className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full", className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...props }) => (
  <thead className={className} {...props}>{children}</thead>
);

export const TableBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...props }) => (
  <tbody className={className} {...props}>{children}</tbody>
);

export const TableRow: FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
  <tr className={className} {...props}>{children}</tr>
);

export const TableHead: FC<HTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <th className={cn("text-left text-sm font-medium text-muted-foreground p-2", className)} {...props}>{children}</th>
);

export const TableCell: FC<HTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td className={cn("p-2 text-sm", className)} {...props}>{children}</td>
);

export default Table;
