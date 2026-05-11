const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/bookings";

// Helper to attach auth tokens if you are using them (adjust based on your auth strategy)
const getHeaders = () => ({
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${localStorage.getItem("token")}` // Uncomment if using JWT
});

export const BookingAPI = {
  // Get all bookings for the logged-in customer
  getAllBookings: async () => {
    const res = await fetch(`${BASE_URL}/all-bookings`, { headers: getHeaders() });
    return res.json();
  },

  // Get booking requests (Only for Providers)
  getBookingRequests: async () => {
    const res = await fetch(`${BASE_URL}/booking-requests`, { headers: getHeaders() });
    return res.json();
  },

  // Book a new service
  bookService: async (bookingData) => {
    const res = await fetch(`${BASE_URL}/bookService`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(bookingData), // { serviceOfferingId, scheduleTime, workLocation, customerRequest }
    });
    return res.json();
  },

  // Update booking status
  updateStatus: async (bookingId, statusData) => {
    const res = await fetch(`${BASE_URL}/${bookingId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(statusData),
    });
    return res.json();
  },

  // Complete a booking (Provider submits before/after images & OTP)
  completeBooking: async (bookingId, completionData) => {
    const res = await fetch(`${BASE_URL}/${bookingId}/complete`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(completionData), // { otp, beforeImage, afterImage }
    });
    return res.json();
  },

  // OTP Management for bookings
  sendBookingOtp: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/${bookingId}/send-otp`, { method: "POST", headers: getHeaders() });
    return res.json();
  },

  // Cancellation Flow
  requestCancel: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/${bookingId}/cancel/request`, { method: "POST", headers: getHeaders() });
    return res.json();
  },
  
  confirmCancel: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/${bookingId}/cancel/confirm`, { method: "POST", headers: getHeaders() });
    return res.json();
  }
};