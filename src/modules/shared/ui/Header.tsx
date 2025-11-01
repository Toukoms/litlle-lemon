import { Menu, ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between pt-4 pb-3">
      <Menu className="size-8" />
      <div className="w-32">
        <img src="/logo.jpg" alt="Logo little lemon" />
      </div>
      <ShoppingCart className="size-8" />
    </div>
  );
}
