import { useCallback, useState } from "react";
import { Seat } from "./components/Seat";
import { rows, seatNumbers } from "./constants/seats";
import { Label } from "./components/Label";

const notIncluded = [
  "R39",
  "R40",
  "R41",
  "R42",
  "S39",
  "S40",
  "S41",
  "S42",
  "T39",
  "T40",
  "T41",
  "T42",
  "U39",
  "U40",
  "U41",
  "U42",
  "V39",
  "V40",
  "V41",
  "V42",
];

function App() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const onSelectSeat = (seat: string) => {
    const foundSeat = selectedSeats.find(
      (selectedSeat) => selectedSeat === seat
    );
    // not selected yet
    if (!foundSeat) {
      setSelectedSeats((prevState) => [...prevState, seat]);
    } else {
      const selectedSeatCopy = [...selectedSeats];
      const filteredSeats = selectedSeatCopy.filter(
        (seat) => seat !== foundSeat
      );
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

  return (
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
          <Seat seatState="available" seatTyle="premiere" onPress={() => {}} />
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
        <div>
          <p>Ticket Details</p>
          <div className="divider"></div>
          <div className="flex border border-gray-600 rounded-lg p-4 w-3/4 mx-auto">
            <div className="flex-1 flex flex-col gap-3">
              <Label label="Conference" values="This is the beginning" />
              <Label label="Venue" values="USEP Gymnasium" />
              <Label
                label="Date & Time"
                values="Sunday - July 12, 2025 - 6:00PM"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <Label label="Seats" values="C1, C5, D4" />
              <Label label="Tickets" values="2 VIPs, 3 Premieres" />
              <Label label="Total" values="1,050" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
