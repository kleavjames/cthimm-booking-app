import { FC, useCallback, useMemo, useState } from "react";
import { numberWithCommas, splitStringAndNumbers } from "../utils/strings";
import { notIncluded, price, rows, seatNumbers } from "../constants/seats";
import { Seat } from "../components/Seat";
import { Label } from "../components/Label";
import { BookingModal } from "../components/modals/BookingModal";

type BookingProps = {
  //
};

const Booking: FC<BookingProps> = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [vipCount, setVipCount] = useState(0);
  const [premiereCount, setPremiereCount] = useState(0);

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

  const seatState = useCallback(
    (seat: string) => {
      return selectedSeats.includes(seat) ? "selected" : "available";
    },
    [selectedSeats]
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

    return `₱ ${numberWithCommas(total)}.00`;
  }, [vipCount, premiereCount]);

  return (
    <>
      <div className="flex flex-col">
        <div className="container mx-auto bg-gray-300 my-10">
          <p className="text-center text-lg text-black font-bold bold py-5">
            STAGE
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-5 mb-5">
          <div className="flex flex-row items-center gap-2">
            <Seat seatState="available" seatTyle="vip" onPress={() => {}} />
            <p>VIP Available</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat seatState="taken" seatTyle="vip" onPress={() => {}} />
            <p>VIP Taken</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat
              seatState="available"
              seatTyle="premiere"
              onPress={() => {}}
            />
            <p>Premiere Available</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat seatState="taken" seatTyle="premiere" onPress={() => {}} />
            <p>Premiere Taken</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Seat seatState="reserved" seatTyle="vip" onPress={() => {}} />
            <p>Reserved</p>
          </div>
        </div>
        <div className="px-10 mx-auto">
          <div className="max-w-full h-[750px] overflow-scroll">
            <div className="flex flex-col gap-2 m-2">
              {rows.map((row) => (
                <div className="flex flex-row gap-10">
                  <div className="flex flex-row gap-2">
                    <p className="w-10">{row}</p>
                    {seatNumbers[0].map((seatNum) => {
                      const seatName = `${row}${seatNum}`;
                      return (
                        <Seat
                          key={seatNum}
                          seatNum={seatNum}
                          seatState={seatState(seatName)}
                          seatTyle={handleSeatType(row) ? "vip" : "premiere"}
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
                          seatState={seatState(seatName)}
                          seatTyle={handleSeatType(row) ? "vip" : "premiere"}
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
                          seatState={seatState(seatName)}
                          seatTyle={handleSeatType(row) ? "vip" : "premiere"}
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
                          seatState={seatState(seatName)}
                          seatTyle={handleSeatType(row) ? "vip" : "premiere"}
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
          <div className="flex flex-row justify-between items-center">
            <p className="text-lg font-bold">Booking Details</p>
            <button
              className="btn btn-primary px-10"
              disabled={seatsSelected.length === 0}
              onClick={() => {
                // eslint-disable-next-line
                (document.getElementById("process_booking") as any).showModal();
              }}
            >
              Proceed booking
            </button>
          </div>
          <div className="divider"></div>
          <div className="flex flex-row gap-10">
            <div className="flex flex-1 flex-col gap-3 border border-gray-500 p-6 rounded-lg">
              <Label label="Name" values="CTHIMM Conference" />
              <Label label="Venue" values="USEP Gymnasium" />
              <Label
                label="Date & Time"
                values="September 23, 2025 - 6:00PM (Sunday)"
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
              <Label label="Total Amount" values={totalAmount} />
            </div>
          </div>
        </div>
      </div>
      <BookingModal
        seats={seatsSelected}
        breakDown={breakDownText}
        total={totalAmount}
      />
    </>
  );
};

export default Booking;
