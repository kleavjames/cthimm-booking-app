import { SeatCategoryEnum, SeatStatusEnum } from "@/constants/seats";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bookings } from "@/types/bookings";

type SeatProps = {
  seatNum?: number;
  onPress: () => void;
  seatStatus: SeatStatusEnum;
  seatCategory: SeatCategoryEnum;
  notIncluded?: boolean;
  bookDetail?: Bookings;
};

export const Seat: FC<SeatProps> = ({
  seatNum,
  seatCategory,
  onPress,
  seatStatus = "available",
  notIncluded = false,
  bookDetail,
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
    <Tooltip>
      <TooltipTrigger>
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
              (seatStatus === SeatStatusEnum.RESERVED ||
                seatStatus === "taken") &&
                "text-white",
              seatStatus === SeatStatusEnum.SELECTED && "text-orange-100",
              notIncluded && "opacity-0"
            )}
          >
            {seatNum}
          </p>
        </div>
      </TooltipTrigger>
      {bookDetail && (
        <TooltipContent>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="font-bold">{bookDetail.fullname}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Network/Churches</p>
              <p className="font-bold">{bookDetail.network}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Status</p>
              {bookDetail.seat_status === SeatStatusEnum.TAKEN ? (
                <p className="font-bold text-green-400">Confirmed</p>
              ) : (
                <p className="font-bold text-orange-400">Pending</p>
              )}
            </div>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
