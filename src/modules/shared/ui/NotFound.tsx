import { Home, Search } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-yellow-600" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600">
              Oops! The page you're looking for doesn't exist. It might have
              been moved or deleted.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoHome}
            className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
