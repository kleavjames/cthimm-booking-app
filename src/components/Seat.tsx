import { FC } from "react";
import { twMerge } from "tailwind-merge";

type SeatProps = {
  seatNum?: number;
  onPress: () => void;
  seatTyle: "vip" | "premiere";
  seatState: "available" | "reserved" | "taken" | "selected";
  notIncluded?: boolean;
};

export const Seat: FC<SeatProps> = ({
  seatNum,
  seatState = "available",
  onPress,
  seatTyle,
  notIncluded = false,
}) => {
  const isSeatTaken = seatState === "taken";
  const isSeatReserved = seatState === "reserved";
  const isSeatSelected = seatState === "selected";
  const isSeatAvailable = seatState === "available";
  const isVIP = seatTyle === "vip" && isSeatAvailable;
  const isSeatTakenForVIP = seatTyle === "vip" && isSeatTaken;
  const isPremiere = seatTyle === "premiere" && isSeatAvailable;
  const isSeatTakenForPremiere = seatTyle === "premiere" && isSeatTaken;

  return (
    <div
      onClick={notIncluded ? undefined : onPress}
      className={twMerge(
        "w-7 h-7 border rounded-sm flex justify-center items-center cursor-pointer",
        isVIP && "border-blue-400",
        isPremiere && "border-green-400",
        isSeatTakenForVIP && "border-blue-500 bg-blue-500",
        isSeatTakenForPremiere && "border-green-600 bg-green-600",
        isSeatReserved && "border-orange-400 bg-orange-400",
        isSeatSelected && "border-orange-100",
        notIncluded && "bg-gray-600 border-gray-600"
      )}
    >
      <p
        className={twMerge(
          "text-xs",
          seatState === "available" && "text-gray-800",
          (seatState === "reserved" || seatState === "taken") && "text-white",
          seatState === "selected" && "text-orange-100",
          notIncluded && "opacity-0"
        )}
      >
        {seatNum}
      </p>
    </div>
  );
};
