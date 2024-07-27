import supabase from "@/config/supabase";
import { SeatCategoryEnum, SeatStatusEnum } from "@/constants/seats";
import { Bookings, NetworkStats } from "@/types/bookings";
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
import { useCallback, useEffect, useState } from "react";
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
import { Pagination } from "@/components/Tables/Pagination";
import {
  networks,
  luzonChurches,
  mindanaoChurches,
  visayasChurches,
} from "@/constants/networks";

const initialNetworkStats = [
  ...networks,
  ...luzonChurches,
  ...visayasChurches,
  ...mindanaoChurches,
].map((network) => ({
  name: network.name,
  vip: 0,
  premiere: 0,
  deluxe: 0,
  total: 0,
}));

const NetworkStatistics = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats[]>([]);
  // states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: networkStats,
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

  const getBookingsByNetwork = useCallback(async () => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("seat_status", SeatStatusEnum.TAKEN);

    if (error) {
      alert("An error occurred while fetching reservations.");
      console.error("Error fetching reservations:", error.message);
      return;
    }

    if (bookings) {
      onFormatNetworkStats(bookings);
    }
  }, []);

  useEffect(() => {
    getBookingsByNetwork();
  }, [getBookingsByNetwork]);

  const onFormatNetworkStats = (bookings: Bookings[]) => {
    const networkStats: NetworkStats[] = initialNetworkStats.map((network) => {
      const networkBookings = bookings.filter(
        (booking) => booking.network === network.name
      );

      const vip = networkBookings.filter(
        (booking) => booking.seat_category === SeatCategoryEnum.VIP
      ).length;
      const premiere = networkBookings.filter(
        (booking) => booking.seat_category === SeatCategoryEnum.PREMIERE
      ).length;
      const deluxe = networkBookings.filter(
        (booking) => booking.seat_category === SeatCategoryEnum.DELUXE
      ).length;
      const total = vip + premiere + deluxe;

      return {
        network: network.name,
        vip,
        premiere,
        deluxe,
        total,
      };
    });

    setNetworkStats(networkStats);
  };

  return (
    <>
      <p className="font-bold text-4xl py-5">Confirmed Bookings</p>
      <div className="py-2">
        <div className="flex items-center py-4 justify-between">
          <div className="flex flex-row gap-5">
            <Input
              placeholder="Search network"
              value={
                (table.getColumn("network")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("network")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
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
    </>
  );
};

export default NetworkStatistics;
