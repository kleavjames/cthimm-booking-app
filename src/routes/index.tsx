/* eslint-disable react-refresh/only-export-components */
import MainLayout from "@/layout/MainLayout";
import Booking from "@/pages/Booking";
import Reservations from "@/pages/Reservations";
import Statistics from "@/pages/Statistics";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Booking />,
      },
      {
        path: "/reservations",
        element: <Reservations />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
    ],
  },
]);

export default router;
