import { create } from "zustand";

type SeatState = {
  selectedSeats: string[];
  deluxeSeats: string[];
  vipCount: number;
  premiereCount: number;
  deluxeCount: number;
  setSelectedSeats: (seats: string[]) => void;
  setDeluxeSeats: (seats: string[]) => void;
  setVipCount: (count: number) => void;
  setPremiereCount: (count: number) => void;
  setDeluxeCount: (count: number) => void;
};

const useSeatStore = create<SeatState>()((set) => ({
  selectedSeats: [],
  deluxeSeats: [],
  vipCount: 0,
  premiereCount: 0,
  deluxeCount: 0,
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setDeluxeSeats: (seats) => set({ deluxeSeats: seats }),
  setVipCount: (count) => set({ vipCount: count }),
  setPremiereCount: (count) => set({ premiereCount: count }),
  setDeluxeCount: (count) => set({ deluxeCount: count }),
}));

export default useSeatStore;
