import { SeatCategoryEnum, SeatStatusEnum } from "@/constants/seats";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

type SeatProps = {
  seatNum?: number;
  onPress: () => void;
  seatStatus: SeatStatusEnum;
  seatCategory: SeatCategoryEnum;
  notIncluded?: boolean;
};

export const Seat: FC<SeatProps> = ({
  seatNum,
  seatCategory,
  onPress,
  seatStatus = "available",
  notIncluded = false,
}) => {
  const isSeatTaken = seatStatus === SeatStatusEnum.TAKEN;
  const isSeatReserved = seatStatus === SeatStatusEnum.RESERVED;
  const isSeatSelected = seatStatus === SeatStatusEnum.SELECTED;
  const isSeatAvailable = seatStatus === SeatStatusEnum.AVAILABLE;
  const isVIP = seatCategory === SeatCategoryEnum.VIP && isSeatAvailable;
  const isSeatTakenForVIP =
    seatCategory === SeatCategoryEnum.VIP && isSeatTaken;
  const isPremiere =
    seatCategory === SeatCategoryEnum.PREMIERE && isSeatAvailable;
  const isSeatTakenForPremiere =
    seatCategory === SeatCategoryEnum.PREMIERE && isSeatTaken;

  return (
    <div
      onClick={
        notIncluded || isSeatReserved || isSeatTaken ? undefined : onPress
      }
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
          seatStatus === SeatStatusEnum.AVAILABLE && "text-gray-800",
          (seatStatus === SeatStatusEnum.RESERVED || seatStatus === "taken") &&
            "text-white",
          seatStatus === SeatStatusEnum.SELECTED && "text-orange-100",
          notIncluded && "opacity-0"
        )}
      >
        {seatNum}
      </p>
    </div>
  );
};
