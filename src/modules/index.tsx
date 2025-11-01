import { Outlet } from "react-router";
import { Footer } from "./shared/ui/Footer";
import { Header } from "./shared/ui/Header";

export function RootLayout() {
  return (
    <main className="max-w-3xl mx-auto overflow-x-hidden bg-white sm:px-2">
      <Header />
      <div className="space-y-6 py-6 tracking-wide">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
