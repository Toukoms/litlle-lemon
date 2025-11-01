import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Body from "../../shared/ui/Body";

function PaymentHeading() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Payment Details</h2>
      <p className="text-lg">
        Secure your reservation with a credit card. You will not be charged
        unless you cancel within 24 hours.
      </p>
    </div>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationData = location.state?.reservationData;
  const customerData = location.state?.customerData;

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderFirstName: customerData?.firstName || "",
    cardholderLastName: customerData?.lastName || "",
    expirationDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: false,
    cardholderFirstName: false,
    cardholderLastName: false,
    expirationDate: false,
    cvv: false,
  });

  const [showCvvInfo, setShowCvvInfo] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpirationDate = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: formatted,
    });
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: false });
    }
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value);
    setFormData({
      ...formData,
      expirationDate: formatted,
    });
    if (errors.expirationDate) {
      setErrors({ ...errors, expirationDate: false });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").substring(0, 4);
    setFormData({
      ...formData,
      cvv: cleaned,
    });
    if (errors.cvv) {
      setErrors({ ...errors, cvv: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {
      cardNumber:
        formData.cardNumber.replace(/\s/g, "").length < 13 ||
        formData.cardNumber.replace(/\s/g, "").length > 19,
      cardholderFirstName: formData.cardholderFirstName.trim() === "",
      cardholderLastName: formData.cardholderLastName.trim() === "",
      expirationDate: formData.expirationDate.length !== 5,
      cvv: formData.cvv.length < 3,
    };

    setErrors(newErrors);

    // If any errors, don't submit
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  return (
    <>
      <Body heading={PaymentHeading}>
        <div className="p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div className="space-y-2">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-semibold text-gray-700"
              >
                Credit Card Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 size-6" />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-red-500">
                  Please enter a valid card number
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="cardholderFirstName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardholderFirstName"
                  name="cardholderFirstName"
                  value={formData.cardholderFirstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.cardholderFirstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.cardholderFirstName && (
                  <p className="text-sm text-red-500">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cardholderLastName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardholderLastName"
                  name="cardholderLastName"
                  value={formData.cardholderLastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.cardholderLastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.cardholderLastName && (
                  <p className="text-sm text-red-500">Required</p>
                )}
              </div>
            </div>

            {/* Expiration Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleExpirationChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.expirationDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expirationDate && (
                  <p className="text-sm text-red-500">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cvv"
                  className="block text-sm font-semibold text-gray-700"
                >
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cvv && <p className="text-sm text-red-500">Required</p>}
              </div>
            </div>

            {/* CVV Information */}
            <div className="bg-gray-100/80 p-4 rounded-md border border-gray-200">
              <button
                type="button"
                onClick={() => setShowCvvInfo(!showCvvInfo)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-semibold text-gray-700">
                  Where is my CVV?
                </span>
                <span className="text-yellow-400 font-bold">
                  {showCvvInfo ? "−" : "+"}
                </span>
              </button>
              {showCvvInfo && (
                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  <p>
                    The CVV (Card Verification Value) is a 3 or 4 digit security
                    code on your credit card.
                  </p>
                  <p className="font-semibold">Location:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Visa, Mastercard, Discover:</strong> 3 digits on
                      the back of the card
                    </li>
                    <li>
                      <strong>American Express:</strong> 4 digits on the front
                      of the card
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Required Fields Note */}
            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Required fields
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200"
            >
              Confirm and Secure Reservation
            </button>
          </form>
        </div>
      </Body>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Your Place is Reserved!
              </h3>
              <p className="text-gray-600">
                Thank you for your reservation at Little Lemon. We look forward
                to serving you!
              </p>
              {reservationData && customerData && (
                <div className="bg-gray-50 p-4 rounded-md text-left space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {customerData.firstName}{" "}
                    {customerData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {customerData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {customerData.phone}
                  </p>
                  <hr className="my-2 border-gray-200" />
                  <p>
                    <strong>Date:</strong> {reservationData.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {reservationData.time}
                  </p>
                  <p>
                    <strong>Guests:</strong> {reservationData.diners}
                  </p>
                  <p>
                    <strong>Seating:</strong>{" "}
                    {reservationData.seating === "standard"
                      ? "Standard"
                      : "Outside"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleCloseConfirmation}
              className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
