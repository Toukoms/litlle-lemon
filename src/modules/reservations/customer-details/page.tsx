import { useState } from "react";
import { useLocation } from "react-router";
import Body from "../../shared/ui/Body";

function CustomerDetailsHeading() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Customer Details</h2>
      <p className="text-lg">
        Please provide your contact information to complete your reservation.
      </p>
    </div>
  );
}

export function CustomerDetailsPage() {
  const location = useLocation();
  const reservationData = location.state?.reservationData;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {
      firstName: formData.firstName.trim() === "",
      lastName: formData.lastName.trim() === "",
      email: formData.email.trim() === "",
      phone: formData.phone.trim() === "",
    };

    setErrors(newErrors);

    // If any errors, don't submit
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // TODO: Submit reservation with customer details
    console.log("Complete reservation:", {
      ...reservationData,
      customer: formData,
    });

    // TODO: Navigate to confirmation page
    alert("Reservation confirmed!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  return (
    <Body heading={CustomerDetailsHeading}>
      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-700"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">First name is required</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-700"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">Last name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">Email is required</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">Phone number is required</p>
            )}
          </div>

          {/* Required Fields Note */}
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Required fields
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200 cursor-pointer"
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </Body>
  );
}
