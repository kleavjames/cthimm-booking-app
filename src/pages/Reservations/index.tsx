import supabase from "@/config/supabase";
import { SeatStatusEnum } from "@/constants/seats";
import { Bookings } from "@/types/bookings";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TRow } from "@/components/Tables/TRow";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Tables/Pagination";

const Reservations = () => {
  const [reservations, setReservations] = useState<Bookings[]>([]);
  // states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: reservations,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  useEffect(() => {
    getReservationBookings();
  }, []);

  const getReservationBookings = async () => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("seat_status", SeatStatusEnum.RESERVED);

    if (error) {
      alert("An error occurred while fetching reservations.");
      console.error("Error fetching reservations:", error.message);
      return;
    }

    if (bookings) {
      setReservations(bookings);
    }
  };

  const onConfirmBooking = async (selectedRows: Bookings[]) => {
    if (selectedRows.length === 0) {
      alert("Please select a reservation to confirm.");
      return;
    }
    const { data: updatedReservations, error } = await supabase
      .from("bookings")
      .update({ seat_status: SeatStatusEnum.TAKEN })
      .in(
        "id",
        selectedRows.map((row) => row.id)
      )
      .select("*");

    if (error) {
      alert("An error occurred while confirming bookings.");
      console.error("Error confirming bookings:", error.message);
      return;
    }

    if (updatedReservations) {
      getReservationBookings();
      table.toggleAllRowsSelected(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="my-5">
        <h1>Reservations</h1>
      </div>
      <div className="py-2">
        <div className="flex items-center py-4 justify-between">
          <div className="flex flex-row gap-5">
            <Input
              placeholder="Search reference #"
              value={
                (table
                  .getColumn("reference_number")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("reference_number")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Input
              placeholder="Search by name"
              value={
                (table.getColumn("fullname")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("fullname")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <Button
            variant="default"
            className="px-10"
            onClick={() => {
              const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original);
              onConfirmBooking(selectedRows);
            }}
          >
            Confirm
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TRow
                table={table}
                colLength={columns.length}
                emptyMessage="No reservations at the moment."
              />
            </TableBody>
          </Table>
        </div>
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default Reservations;
