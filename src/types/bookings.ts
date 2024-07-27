export type Bookings = {
  id: number;
  created_at: string;
  seat: string;
  seat_category: string;
  seat_status: string;
  fullname: string;
  mobile: string;
  network: string;
  amount: number;
  cancellation_date: string;
  reference_number: string;
};

export type NetworkStats = {
  network: string;
  vip: number;
  premiere: number;
  deluxe: number;
  total: number;
};
