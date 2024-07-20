import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SeatCategoryEnum } from "@/constants/seats";
import { Bookings } from "@/types/bookings";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Bookings>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "seat",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Seat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("seat")}</div>;
    },
  },
  {
    accessorKey: "seat_category",
    accessorFn: (row) =>
      row.seat_category === SeatCategoryEnum.VIP
        ? "VIP"
        : row.seat_category === SeatCategoryEnum.PREMIERE
        ? "Premiere"
        : "Deluxe",
    header: "Seat Category",
    cell: ({ row }) => <div>{row.getValue("seat_category")}</div>,
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => <div>{row.getValue("network")}</div>,
  },
  {
    accessorKey: "fullname",
    header: "Full Name",
    cell: ({ row }) => <div>{row.getValue("fullname")}</div>,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
  },
];
