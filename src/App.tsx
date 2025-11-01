import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "./modules";
import { HomePage } from "./modules/home/page";
import { CustomerDetailsPage } from "./modules/reservations/customer-details/page";
import { ReservationsPage } from "./modules/reservations/page";
import { PaymentPage } from "./modules/reservations/payment/page";
import { ErrorBoundary } from "./modules/shared/ui/Error";
import { Loading } from "./modules/shared/ui/Loading";
import { NotFound } from "./modules/shared/ui/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    HydrateFallback: Loading,
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
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
