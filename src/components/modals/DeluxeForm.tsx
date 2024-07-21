import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
import { Label as FormLabel } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { generateStringWithRandomNumbers } from "@/utils/strings";
import useSeatStore from "@/store/seatStore";

export const DeluxeModal: FC = () => {
  const deluxeCount = useSeatStore((state) => state.deluxeCount);
  const setDeluxeCount = useSeatStore((state) => state.setDeluxeCount);
  const setDeluxeSeats = useSeatStore((state) => state.setDeluxeSeats);

  const [seatCount, setSeatCount] = useState(0);

  useEffect(() => {
    if (deluxeCount > 0) setSeatCount(deluxeCount);
  }, [deluxeCount]);

  const onBookDeluxe = () => {
    const deluxeSeating = Array.from({ length: seatCount }, () =>
      generateStringWithRandomNumbers()
    );
    setDeluxeSeats([...deluxeSeating]);
    setDeluxeCount(seatCount);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-500 text-white font-bold text-lg w-[500px] h-[100px] hover:bg-red-600">
          BOOK HERE FOR DELUXE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deluxe</DialogTitle>
          <DialogDescription>Please input number of seats</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-4">
          <div className="flex flex-col gap-5">
            <div className="grid w-full max-w-sm items-center gap-2">
              <FormLabel htmlFor="numSeats">No. of seats</FormLabel>
              <Input
                type="number"
                id="numSeats"
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value))}
                placeholder="Put 1 if book for yourself only"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onBookDeluxe}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
