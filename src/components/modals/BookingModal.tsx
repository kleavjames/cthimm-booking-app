import { FC } from "react";
import { Label } from "../Label";
import { networks } from "../../constants/networks";

type BookingModalProps = {
  seats: string;
  breakDown: string;
  total: string;
};

export const BookingModal: FC<BookingModalProps> = ({
  seats,
  breakDown,
  total,
}) => {
  return (
    <dialog id="process_booking" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Booking details</h3>
        <div className="my-10 flex gap-5 flex-col">
          <div className="flex flex-row gap-5">
            <div className="flex-1">
              <Label label="Seats Selected" values={seats} />
            </div>
            <div className="flex-1">
              <Label
                label="Tickets x Quantities"
                values={breakDown}
                placeholder="No tickets selected"
              />
            </div>
          </div>
          <Label label="Total Amount" values={total} />
          <label className="form-control w-full max-w-full">
            <div className="label">
              <span className="label-text">Full name</span>
            </div>
            <input
              type="text"
              placeholder="Name of the one who booked"
              className="input input-bordered w-full max-w-full"
            />
          </label>
          <label className="form-control w-full max-w-full">
            <div className="label">
              <span className="label-text">Network or Church</span>
            </div>
            <select className="select select-bordered">
              <option selected disabled>
                Pick one
              </option>
              {networks.map((network) => (
                <option key={network.id} disabled={network.id >= 900}>
                  {network.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-5">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-ghost">Back</button>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
