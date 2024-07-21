import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "../Label";
import { FC, useState } from "react";
import { Label as FormLabel } from "@/components/ui/label";
import { NetworkSelect } from "../NetworkSelect";
import { price, SeatCategoryEnum, SeatStatusEnum } from "@/constants/seats";
import { splitStringAndNumbers } from "@/utils/strings";
import supabase from "@/config/supabase";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { BookingReceipt } from "../BookingReceipt";
import { Bookings } from "@/types/bookings";
import useSeatStore from "@/store/seatStore";
import useReferenceStore from "@/store/referenceStore";

type BookingModalProps = {
  breakDown: string;
  totalDisplay: string;
  seatsDisplay: string;
  total: number;
  onConfirm: (show: boolean) => void;
};

export const BookingModal: FC<BookingModalProps> = ({
  breakDown,
  totalDisplay,
  onConfirm,
  seatsDisplay,
  total = 0,
}) => {
  const deluxeSeats = useSeatStore((state) => state.deluxeSeats);
  const referenceNumber = useReferenceStore((state) => state.referenceNumber);
  const generateNewReference = useReferenceStore(
    (state) => state.generateNewReference
  );

  const [fullName, setFullName] = useState("");
  const [network, setNetwork] = useState("");
  const [mobile, setMobile] = useState("");

  const generatePdfDocument = async (booking: Bookings[]) => {
    const blob = await pdf(
      <BookingReceipt referenceNumber={referenceNumber} bookings={booking} />
    ).toBlob();
    saveAs(blob, `booking-receipt-${referenceNumber}.pdf`);
  };

  const onSubmitBooking = async () => {
    const seating = seatsDisplay.split(",").map((seat) => seat.trim());

    const getSeatCategory = (seat: string) => {
      const { letters } = splitStringAndNumbers(seat);
      const letter = letters[0] as string;

      if (
        typeof letter === "string" &&
        letter.length === 1 &&
        /^[A-Z]$/.test(letter)
      ) {
        const charCode = letter?.charCodeAt(0);
        return charCode >= "A".charCodeAt(0) && charCode <= "Q".charCodeAt(0)
          ? SeatCategoryEnum.VIP
          : SeatCategoryEnum.PREMIERE;
      }

      if (seat.includes("Deluxe")) {
        return SeatCategoryEnum.DELUXE;
      }

      return SeatCategoryEnum.PREMIERE;
    };

    const vipAndPremierBookingDetails = seating
      .filter((seat) => !seat.includes("Deluxe"))
      .map((seat) => {
        // date now + 1 day for cancellation
        const cancellation_date = new Date();
        cancellation_date.setDate(cancellation_date.getDate() + 1);

        return {
          seat,
          seat_category: getSeatCategory(seat),
          seat_status: SeatStatusEnum.RESERVED,
          fullname: fullName,
          mobile,
          network,
          amount:
            getSeatCategory(seat) === SeatCategoryEnum.VIP
              ? price.vip
              : price.premier,
          cancellation_date,
        };
      });

    const deluxeBooking = deluxeSeats.map((seat) => {
      // date now + 1 day for cancellation
      const cancellation_date = new Date();
      cancellation_date.setDate(cancellation_date.getDate() + 1);

      return {
        seat,
        seat_category: SeatCategoryEnum.DELUXE,
        seat_status: SeatStatusEnum.RESERVED,
        fullname: fullName,
        mobile,
        network,
        amount: price.deluxe,
        cancellation_date,
      };
    });

    let bookingDetails = [...vipAndPremierBookingDetails, ...deluxeBooking];
    bookingDetails = bookingDetails.map((booking) => ({
      ...booking,
      reference_number: referenceNumber,
    }));

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingDetails)
      .select();

    if (error) {
      alert("Failed to process booking");
    }
    if (data) {
      // clear data
      setFullName("");
      setMobile("");
      setNetwork("");

      generatePdfDocument(data);
      onConfirm(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={generateNewReference}
          disabled={total === 0}
          variant="default"
          className="px-10"
        >
          Process Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Check booking details before proceeding
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-4">
          <div className="flex flex-row gap-5">
            <div className="flex-1">
              <Label label="Seats Selected" values={seatsDisplay} />
            </div>
            <div className="flex-1">
              <Label
                label="Tickets x Quantities"
                values={breakDown}
                placeholder="No tickets selected"
              />
            </div>
          </div>
          <Label label="Total Amount" values={totalDisplay} />

          <div className="flex flex-col gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormLabel htmlFor="fullName">Full name</FormLabel>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name of the booker"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormLabel htmlFor="network">Network</FormLabel>
              <NetworkSelect value={network} onChange={setNetwork} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormLabel htmlFor="mobile">Mobile #</FormLabel>
              <Input
                type="number"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile number"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild disabled={!fullName || !network || !mobile}>
            <Button type="submit" onClick={onSubmitBooking}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
