import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "./modules";
import { HomePage } from "./modules/home/page";
import { ReservationsPage } from "./modules/reservations/page";

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
        Component: ReservationsPage,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
