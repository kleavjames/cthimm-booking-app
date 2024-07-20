import { FC } from "react";
import { Button } from "../ui/button";
import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Pagination: FC<PaginationProps<any>> = ({ table }) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Pages {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount() === 0 ? 1 : table.getPageCount()}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
