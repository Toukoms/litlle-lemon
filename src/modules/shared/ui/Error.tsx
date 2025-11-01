import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
    errorDetails = `Error ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = "Something went wrong";
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Oops!</h1>
            <p className="text-sm text-gray-500">{errorDetails}</p>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="w-full px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
