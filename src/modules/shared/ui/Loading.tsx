import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Loading...</h2>
        <p className="text-gray-600">Please wait while we prepare your page</p>
      </div>
    </div>
  );
}
