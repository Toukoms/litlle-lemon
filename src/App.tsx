import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "./modules";
import { HomePage } from "./modules/home/page";
import { CustomerDetailsPage } from "./modules/reservations/customer-details/page";
import { ReservationsPage } from "./modules/reservations/page";
import { PaymentPage } from "./modules/reservations/payment/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "reservations",
        children: [
          {
            index: true,
            Component: ReservationsPage,
          },
          {
            path: "customer-details",
            Component: CustomerDetailsPage,
          },
          {
            path: "payment",
            Component: PaymentPage,
          },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
