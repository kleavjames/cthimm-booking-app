import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { numberWithCommas, splitStringAndNumbers } from "../utils/strings";
import {
  maxDeluxeSeatCount,
  notIncluded,
  price,
  rows,
  SeatCategoryEnum,
  seatNumbers,
  SeatStatusEnum,
} from "../constants/seats";
import { Seat } from "../components/Seat";
import { Label } from "../components/Label";
import { BookingModal } from "@/components/modals/BookingModal";
import supabase from "@/config/supabase";
import { Bookings } from "@/types/bookings";
import { DeluxeSeatModal } from "@/components/modals/DeluxeSeatModal";
import useSeatStore from "@/store/seatStore";
import { useShallow } from "zustand/react/shallow";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import useReferenceStore from "@/store/referenceStore";

const Booking: FC = () => {
  const [selectedSeats, vipCount, premiereCount, deluxeCount] = useSeatStore(
    useShallow((state) => [
      state.selectedSeats,
      state.vipCount,
      state.premiereCount,
      state.deluxeCount,
    ])
  );
  const setSelectedSeats = useSeatStore((state) => state.setSelectedSeats);
  const setDeluxeSeats = useSeatStore((state) => state.setDeluxeSeats);
  const setVipCount = useSeatStore((state) => state.setVipCount);
  const setPremiereCount = useSeatStore((state) => state.setPremiereCount);
  const setDeluxeCount = useSeatStore((state) => state.setDeluxeCount);
  const referenceNumber = useReferenceStore((state) => state.referenceNumber);

  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [deluxeTaken, setDeluxeTaken] = useState(0);

  useEffect(() => {
    fetchBookings();
    fetchDeluxeSeats();
  }, []);

  // const onCancellationBooking = async () => {
  //   const { error } = await supabase
  //     .from("bookings")
  //     .delete()
  //     .gt("cancellation_date", new Date());

  //   if (error) {
  //     console.error("Error fetching bookings", error);
  //     return;
  //   }

  //   fetchBookings();
  // };

  const fetchDeluxeSeats = async () => {
    const { error, count: deluxeCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .or(
        "seat_category.eq.deluxe,and(seat_status.eq.taken,seat_status.eq.reserved)"
      );

    if (error) {
      console.error("Error fetching deluxe seats", error);
      return;
    }

    if (deluxeCount) {
      console.log("delux count", deluxeCount);
      setDeluxeTaken(deluxeCount);
    }
  };

  const fetchBookings = async () => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*");

    if (error) {
      console.error("Error fetching bookings", error);
      return;
    }

    if (bookings) {
      setBookings(bookings);
    }
  };

  const onHandleCounts = (seat: string, op: "add" | "subtract") => {
    const { letters } = splitStringAndNumbers(seat);
    const letter = letters[0] as string;

    if (
      typeof letter === "string" &&
      letter.length === 1 &&
      /^[A-Z]$/.test(letter)
    ) {
      const charCode = letter?.charCodeAt(0);
      if (charCode >= "A".charCodeAt(0) && charCode <= "Q".charCodeAt(0)) {
        op === "add" ? setVipCount(vipCount + 1) : setVipCount(vipCount - 1);
      } else {
        op === "add"
          ? setPremiereCount(premiereCount + 1)
          : setPremiereCount(premiereCount - 1);
      }
    } else {
      op === "add"
        ? setPremiereCount(premiereCount + 1)
        : setPremiereCount(premiereCount - 1);
    }
  };

  const onSelectSeat = (seat: string) => {
    const foundSeat = selectedSeats.find(
      (selectedSeat) => selectedSeat === seat
    );
    // not selected yet
    if (!foundSeat) {
      onHandleCounts(seat, "add");
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      const selectedSeatCopy = [...selectedSeats];
      const filteredSeats = selectedSeatCopy.filter(
        (seat) => seat !== foundSeat
      );
      onHandleCounts(seat, "subtract");
      setSelectedSeats([...filteredSeats]);
    }
  };

  const handleSeatType = (seatType: string) => {
    if (
      typeof seatType === "string" &&
      seatType.length === 1 &&
      /^[A-Z]$/.test(seatType)
    ) {
      const charCode = seatType.charCodeAt(0);
      return charCode >= "A".charCodeAt(0) && charCode <= "Q".charCodeAt(0);
    }
    return false;
  };

  const getSeatStatus = useCallback(
    (seat: string) => {
      const booking = bookings.find((booking) => booking.seat === seat);
      if (booking) {
        return booking.seat_status as SeatStatusEnum;
      } else {
        return selectedSeats.includes(seat)
          ? SeatStatusEnum.SELECTED
          : SeatStatusEnum.AVAILABLE;
      }
    },
    [bookings, selectedSeats]
  );

  const getSeatDetail = useCallback(
    (seat: string) => {
      const booking = bookings.find((booking) => booking.seat === seat);
      if (booking) {
        return booking;
      }
    },
    [bookings]
  );

  // display in booking details
  const seatsSelected = useMemo(() => {
    return selectedSeats.join(", ");
  }, [selectedSeats]);

  // display in booking details
  const breakDownText = useMemo(() => {
    let text = "";
    if (vipCount > 0) {
      text += `${vipCount} VIP${vipCount <= 1 ? "" : "s"}`;
    }
    if (premiereCount > 0) {
      text +=
        vipCount !== 0
          ? `, ${premiereCount} Premier${premiereCount <= 1 ? "" : "s"}`
          : `${premiereCount} Premier${premiereCount <= 1 ? "" : "s"}`;
    }
    if (deluxeCount > 0) {
      text +=
        vipCount !== 0 || premiereCount !== 0
          ? `, ${deluxeCount} Deluxe`
          : `${deluxeCount} Deluxe`;
    }
    return text;
  }, [vipCount, premiereCount, deluxeCount]);

  const totalAmount = useMemo(() => {
    const { vip, premier, deluxe } = price;
    const total =
      vip * vipCount + premier * premiereCount + deluxe * deluxeCount;

    return {
      display: `₱ ${numberWithCommas(total)}.00`,
      value: total,
    };
  }, [vipCount, premiereCount, deluxeCount]);

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
    setDeluxeSeats([]);
    setVipCount(0);
    setPremiereCount(0);
    setDeluxeCount(0);
  };

  const seatSelectedDisplay = useMemo(() => {
    if (deluxeCount > 0) {
      return `${seatsSelected}${
        selectedSeats.length > 0 ? "," : ""
      } Deluxe Seat${deluxeCount > 1 ? "s" : ""}`;
    }

    return seatsSelected;
  }, [deluxeCount, seatsSelected, selectedSeats.length]);

  return (
    <>
      <div className="flex flex-col">
        <div className="container mx-auto bg-gray-300 my-10">
          <p className="text-center text-lg text-black font-bold bold py-5">
            STAGE
          </p>
        </div>

        <div className="container mx-auto mb-5">
          <div className="flex flex-row justify-center md:gap-10">
            <div className="flex flex-row items-center gap-2">
              <Seat
                seatCategory={SeatCategoryEnum.VIP}
                seatStatus={SeatStatusEnum.AVAILABLE}
                onPress={() => {}}
              />
              <p className="text-xs">VIP Available</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Seat
                seatCategory={SeatCategoryEnum.VIP}
                seatStatus={SeatStatusEnum.TAKEN}
                onPress={() => {}}
              />
              <p className="text-xs">VIP Taken</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Seat
                seatStatus={SeatStatusEnum.AVAILABLE}
                seatCategory={SeatCategoryEnum.PREMIERE}
                onPress={() => {}}
              />
              <p className="text-xs">Premiere Available</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Seat
                seatStatus={SeatStatusEnum.TAKEN}
                seatCategory={SeatCategoryEnum.PREMIERE}
                onPress={() => {}}
              />
              <p className="text-xs">Premiere Taken</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Seat
                seatCategory={SeatCategoryEnum.VIP}
                seatStatus={SeatStatusEnum.RESERVED}
                onPress={() => {}}
              />
              <p className="text-xs">Reserved</p>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto">
          <div className="flex flex-col gap-2 m-2">
            {rows.map((row) => (
              <div key={row} className="flex flex-row gap-10">
                <div className="flex flex-row gap-2">
                  <p className="w-10">{row}</p>
                  {seatNumbers[0].map((seatNum) => {
                    const seatName = `${row}${seatNum}`;
                    return (
                      <Seat
                        key={seatNum}
                        seatNum={seatNum}
                        seatStatus={getSeatStatus(seatName)}
                        bookDetail={getSeatDetail(seatName)}
                        seatCategory={
                          handleSeatType(row)
                            ? SeatCategoryEnum.VIP
                            : SeatCategoryEnum.PREMIERE
                        }
                        notIncluded={notIncluded.includes(seatName)}
                        onPress={() => onSelectSeat(seatName)}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-row gap-2">
                  {seatNumbers[1].map((seatNum) => {
                    const seatName = `${row}${seatNum}`;
                    return (
                      <Seat
                        key={seatNum}
                        seatNum={seatNum}
                        seatStatus={getSeatStatus(seatName)}
                        bookDetail={getSeatDetail(seatName)}
                        seatCategory={
                          handleSeatType(row)
                            ? SeatCategoryEnum.VIP
                            : SeatCategoryEnum.PREMIERE
                        }
                        notIncluded={notIncluded.includes(seatName)}
                        onPress={() => onSelectSeat(seatName)}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-row gap-2">
                  {seatNumbers[2].map((seatNum) => {
                    const seatName = `${row}${seatNum}`;
                    return (
                      <Seat
                        key={seatNum}
                        seatNum={seatNum}
                        seatStatus={getSeatStatus(seatName)}
                        bookDetail={getSeatDetail(seatName)}
                        seatCategory={
                          handleSeatType(row)
                            ? SeatCategoryEnum.VIP
                            : SeatCategoryEnum.PREMIERE
                        }
                        notIncluded={notIncluded.includes(seatName)}
                        onPress={() => onSelectSeat(seatName)}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-row gap-2">
                  {seatNumbers[3].map((seatNum) => {
                    const seatName = `${row}${seatNum}`;
                    return (
                      <Seat
                        key={seatNum}
                        seatNum={seatNum}
                        seatStatus={getSeatStatus(seatName)}
                        bookDetail={getSeatDetail(seatName)}
                        seatCategory={
                          handleSeatType(row)
                            ? SeatCategoryEnum.VIP
                            : SeatCategoryEnum.PREMIERE
                        }
                        notIncluded={notIncluded.includes(seatName)}
                        onPress={() => onSelectSeat(seatName)}
                      />
                    );
                  })}
                  <p className="w-10 text-right">{row}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto my-10">
          <div>
            <p className="text-center font-bold text-red-300 text-lg mb-2">
              {numberWithCommas(maxDeluxeSeatCount - deluxeTaken)} seats
              available for Deluxe
            </p>
          </div>
          <div className="flex justify-center">
            <DeluxeSeatModal />
          </div>
          <div>
            <p className="text-center mt-2">
              Deluxe booking is on balcony area.
              <br /> First come first serve policy.
            </p>
          </div>
        </div>

        <div className="container mx-auto my-10">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="text-lg font-bold">Booking Details</p>
            <BookingModal
              total={totalAmount.value}
              seatsDisplay={seatSelectedDisplay}
              breakDown={breakDownText}
              totalDisplay={totalAmount.display}
              onConfirm={setShowConfirmBooking}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-1 flex-col gap-3 border border-gray-500 p-6 rounded-lg">
              <Label label="Name" values="Restore Philippines Conference" />
              <Label label="Venue" values="USEP Dome" />
              <Label
                label="Date & Time"
                values="(Day 1 - Sat) September 21, 2024 - 12:00nn to 6:00pm"
                valuesTwo="(Day 2 - Sun) September 22, 2024 - 2:00pm to 4:00pm"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 border border-gray-500 p-6 rounded-lg">
              <Label
                label="Seats"
                values={seatSelectedDisplay}
                placeholder="Please select a seat"
              />
              <Label
                label="Tickets x Quantities"
                values={breakDownText}
                placeholder="No tickets selected"
              />
              <Label label="Total Amount" values={totalAmount.display} />
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showConfirmBooking}
        onClear={clearSelectedSeats}
        onDone={fetchBookings}
        setShow={setShowConfirmBooking}
      >
        <div className="mb-5">
          <div className="my-2">
            <p className="text-center font-bold">Booking Reference #</p>
            <p className="text-center text-[40px] font-bold text-green-500">
              {referenceNumber}
            </p>
          </div>
          <div className="mt-5">
            <p className="text-sm text-gray-400 text-center mb-5">
              Please send a direct message to FB Page: CTHIMM Online Portal
              along with your{" "}
              <span className="text-blue-400">booking reference #</span> and
              your <span className="text-blue-400">proof of payment </span>
              (screenshot, deposit slip, or reference no.)
            </p>
          </div>
          <div className="mt-5">
            <div className="border border-gray-600 rounded-md p-2.5">
              <p className="text-sm mb-2 text-gray-400">Payment Details</p>
              <p className="text-sm text-blue-500">Gcash</p>
              <p className="text-sm">Mary Crystel Isais - 09225046717</p>
              <p className="text-sm">Felochie Arnoco - 09983459439</p>
              <p className="text-sm mt-2 text-orange-400">Unionbank</p>
              <p className="text-sm">Mary Crystel Isais - 109350014528</p>
            </div>
          </div>
          <p className="text-sm text-red-400 text-center mt-4">
            You are given 24 hours to pay for your reservation and send your
            proof of payment. Failure to comply will result to the cancellation
            of the reservation.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};

export default Booking;
