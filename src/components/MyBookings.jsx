import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Star } from "lucide-react";
import { BookingAPI } from "../services/bookingApi"; 
import ReviewModal from "./ReviewModal";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Fetch bookings when the page loads
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await BookingAPI.getAllBookings();
        // Assuming your API returns an array. If it returns { data: [...] }, adjust accordingly.
        setBookings(Array.isArray(data) ? data : []); 
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to style the status badges dynamically
  const getStatusDisplay = (status) => {
    const statusMap = {
      "PENDING": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock size={16} />, label: "Pending Approval" },
      "CONFIRMED": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: <CheckCircle size={16} />, label: "Confirmed" },
      "COMPLETED": { color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle size={16} />, label: "Completed" },
      "CANCELLED": { color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle size={16} />, label: "Cancelled" }
    };
    
    // Default to a generic style if status is unknown
    return statusMap[status?.toUpperCase()] || { color: "bg-gray-100 text-gray-800", icon: <AlertCircle size={16} />, label: status || "Unknown" };
  };

  const handleCancelRequest = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await BookingAPI.requestCancel(bookingId);
      // Refresh the list locally to show the new status without reloading the page
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      alert("Booking cancelled successfully.");
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-700">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">When you book a service, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const statusInfo = getStatusDisplay(booking.status);

            return (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                
                {/* Header: Service Name & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {booking.serviceOffering?.name || "Service Booking"}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                <hr className="border-gray-100 dark:border-gray-700 mb-4" />

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>
                        <span className="block font-semibold text-gray-900 dark:text-gray-100">Scheduled Time</span>
                        {new Date(booking.scheduleTime).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>
                        <span className="block font-semibold text-gray-900 dark:text-gray-100">Location</span>
                        {booking.workLocation}
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl flex flex-col justify-center items-start md:items-end border border-gray-100 dark:border-gray-700">
                     <p className="text-sm text-gray-500 font-medium mb-1">Total Price</p>
                     <p className="text-2xl font-black text-gray-900 dark:text-white">
                        ₹{booking.serviceOffering?.price || 0}
                     </p>
                     {booking.provider && (
                       <p className="text-sm text-indigo-600 font-semibold mt-2">
                         Provider: {booking.provider.name}
                       </p>
                     )}
                  </div>
                </div>

                {/* Actions Footer */}
                {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                  <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => handleCancelRequest(booking.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
                {booking.status === "COMPLETED" && !booking.hasReviewed && (
                    <button 
                      onClick={() => {
                        setSelectedBookingForReview(booking);
                        setReviewModalOpen(true);
                      }}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Star size={18} className="fill-green-600" /> Leave a Review
                    </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ReviewModal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
        booking={selectedBookingForReview}
        onSuccess={(bookingId) => {
          // Update local state to hide the review button after submitting
          setBookings(bookings.map(b => b.id === bookingId ? { ...b, hasReviewed: true } : b));
        }}
      />
    </div>
  );
}