import { TableCell, TableRow } from "@/components/ui/table";
import { Table, flexRender } from "@tanstack/react-table";

type TRow<T> = {
  table: Table<T>;
  colLength: number;
  emptyMessage?: string;
};

export function TRow<T>({
  table,
  colLength,
  emptyMessage = "No results",
}: TRow<T>) {
  if (table.getRowModel().rows?.length) {
    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        className={row.getIsSelected() ? "selected" : undefined}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <TableRow>
      <TableCell colSpan={colLength} className="h-24 text-center">
        {emptyMessage}
      </TableCell>
    </TableRow>
  );
}
