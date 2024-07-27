import { Card, CardContent, CardHeader } from "@/components/ui/card";
import supabase from "@/config/supabase";
import { SeatCategoryEnum } from "@/constants/seats";
import { useEffect, useState } from "react";
import NetworkStatistics from "./NetworkStatistics";

const Statistics = () => {
  const [vipCount, setVipCount] = useState(0);
  const [premiereCount, setPremiereCount] = useState(0);
  const [deluxeCount, setDeluxeCount] = useState(0);

  useEffect(() => {
    fetchSeatCounts(SeatCategoryEnum.VIP);
    fetchSeatCounts(SeatCategoryEnum.PREMIERE);
    fetchSeatCounts(SeatCategoryEnum.DELUXE);
  }, []);

  const fetchSeatCounts = async (category: SeatCategoryEnum) => {
    const { error, count: seatCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("seat_category", category)
      .eq("seat_status", "taken");

    if (error) {
      console.error("Error fetching deluxe seats", error);
      return;
    }

    if (seatCount) {
      if (category === SeatCategoryEnum.VIP) {
        setVipCount(seatCount);
      } else if (category === SeatCategoryEnum.PREMIERE) {
        setPremiereCount(seatCount);
      } else if (category === SeatCategoryEnum.DELUXE) {
        setDeluxeCount(seatCount);
      }
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <p className="font-bold text-4xl pt-5 pb-10">Statistics</p>
      <div className="flex flex-row justify-center gap-10 mb-10">
        <Card className="flex-1">
          <CardHeader className="text-blue-400 text-xl text-center">
            VIP
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-blue-400 text-center">
              {vipCount}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="text-green-400 text-xl text-center">
            Premiere
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-green-400 text-center">
              {premiereCount}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="text-red-400 text-xl text-center">
            Deluxe
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-red-400 text-center">
              {deluxeCount}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="text-xl text-center">Total</CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-center">
              {vipCount + premiereCount + deluxeCount}
            </p>
          </CardContent>
        </Card>
      </div>
      <NetworkStatistics />
    </div>
  );
};

export default Statistics;
