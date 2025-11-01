import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "./modules";
import { HomePage } from "./modules/home/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
