import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { numberWithCommas, splitStringAndNumbers } from "../utils/strings";
import {
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
import { Header } from "@/components/Header";

type BookingProps = {
  //
};

const Booking: FC<BookingProps> = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [vipCount, setVipCount] = useState(0);
  const [premiereCount, setPremiereCount] = useState(0);
  const [bookings, setBookings] = useState<Bookings[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const bookingListener = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        ({ errors, new: booking }) => {
          if (!errors) {
            setBookings((prev) => [...prev, booking as Bookings]);
          }
        }
      )
      .subscribe();

    return () => {
      bookingListener.unsubscribe();
    };
  }, []);

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
        op === "add"
          ? setVipCount((prev) => prev + 1)
          : setVipCount((prev) => prev - 1);
      } else {
        op === "add"
          ? setPremiereCount((prev) => prev + 1)
          : setPremiereCount((prev) => prev - 1);
      }
    } else {
      op === "add"
        ? setPremiereCount((prev) => prev + 1)
        : setPremiereCount((prev) => prev - 1);
    }
  };

  const onSelectSeat = (seat: string) => {
    const foundSeat = selectedSeats.find(
      (selectedSeat) => selectedSeat === seat
    );
    // not selected yet
    if (!foundSeat) {
      onHandleCounts(seat, "add");
      setSelectedSeats((prevState) => [...prevState, seat]);
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
    return text;
  }, [vipCount, premiereCount]);

  const totalAmount = useMemo(() => {
    const { vip, premier } = price;
    const total = vip * vipCount + premier * premiereCount;

    return {
      display: `₱ ${numberWithCommas(total)}.00`,
      value: total,
    };
  }, [vipCount, premiereCount]);

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
    setVipCount(0);
    setPremiereCount(0);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col">
        <div className="container mx-auto bg-gray-300 my-10">
          <p className="text-center text-lg text-black font-bold bold py-5">
            STAGE
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-5 mb-5">
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatCategory={SeatCategoryEnum.VIP}
              seatStatus={SeatStatusEnum.AVAILABLE}
              onPress={() => {}}
            />
            <p>VIP Available</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatCategory={SeatCategoryEnum.VIP}
              seatStatus={SeatStatusEnum.TAKEN}
              onPress={() => {}}
            />
            <p>VIP Taken</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatStatus={SeatStatusEnum.AVAILABLE}
              seatCategory={SeatCategoryEnum.PREMIERE}
              onPress={() => {}}
            />
            <p>Premiere Available</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatStatus={SeatStatusEnum.TAKEN}
              seatCategory={SeatCategoryEnum.PREMIERE}
              onPress={() => {}}
            />
            <p>Premiere Taken</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatCategory={SeatCategoryEnum.VIP}
              seatStatus={SeatStatusEnum.RESERVED}
              onPress={() => {}}
            />
            <p>Reserved</p>
          </div>
        </div>
        <div className="px-10 mx-auto">
          <div className="max-w-full h-[750px] overflow-scroll">
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
        </div>
        <div className="container mx-auto my-10">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="text-lg font-bold">Booking Details</p>
            <BookingModal
              seats={seatsSelected}
              breakDown={breakDownText}
              totalDisplay={totalAmount.display}
              onClear={clearSelectedSeats}
            />
          </div>
          <div className="divider"></div>
          <div className="flex flex-row gap-10">
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
                values={seatsSelected}
                placeholder="Please select a set"
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
    </>
  );
};

export default Booking;
