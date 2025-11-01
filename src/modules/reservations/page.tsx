import { useState } from "react";
import Body from "../shared/ui/Body";

function ReservationHeading() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Reserve a Table</h2>
      <p className="text-lg">
        Book your table at Little Lemon and enjoy an authentic Mediterranean
        experience.
      </p>
    </div>
  );
}

export function ReservationsPage() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    diners: "2",
    seating: "standard",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Navigate to confirmation page
    console.log("Reservation data:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate time slots from 17:00 to 22:00
  const timeSlots = [
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  return (
    <Body heading={ReservationHeading}>
      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-700"
            >
              Choose Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <label
              htmlFor="time"
              className="block text-sm font-semibold text-gray-700"
            >
              Choose Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Diners */}
          <div className="space-y-2">
            <label
              htmlFor="diners"
              className="block text-sm font-semibold text-gray-700"
            >
              Number of Diners
            </label>
            <input
              type="number"
              id="diners"
              name="diners"
              min="1"
              max="10"
              value={formData.diners}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Seating Options */}
          <div className="space-y-2">
            <label
              htmlFor="seating"
              className="block text-sm font-semibold text-gray-700"
            >
              Seating Options
            </label>
            <select
              id="seating"
              name="seating"
              value={formData.seating}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="standard">Standard</option>
              <option value="outside">Outside</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </Body>
  );
}
