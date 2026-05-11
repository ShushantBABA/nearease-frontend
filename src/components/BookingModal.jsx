import React, { useState } from "react";
import { Calendar, MapPin, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { BookingAPI } from "../services/bookingApi";
import { PaymentAPI } from "../services/paymentApi";

export default function BookingModal({ service, isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Success
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduleTime: "",
    workLocation: "",
    customerRequest: ""
  });

  if (!isOpen) return null;

  const handleBooking = async () => {
    setLoading(true);
    try {
      // 1. Create the booking in the DB
      const bookingResponse = await BookingAPI.bookService({
        serviceOfferingId: service.id,
        ...bookingData
      });

      if (bookingResponse.success) {
        // 2. Trigger Payment Order (Optional Step)
        await PaymentAPI.createOrder(bookingResponse.id);
        setStep(3); // Move to Success
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-auto max-w-md overflow-hidden">
        
        {/* Step 1: Details Entry */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">When do you need the service?</label>
                <input 
                  type="datetime-local" 
                  className="w-full mt-1 p-2 border rounded-lg"
                  onChange={(e) => setBookingData({...bookingData, scheduleTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Work Location (Address)</label>
                <textarea 
                  placeholder="Enter your full address"
                  className="w-full mt-1 p-2 border rounded-lg"
                  onChange={(e) => setBookingData({...bookingData, workLocation: e.target.value})}
                />
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!bookingData.scheduleTime || !bookingData.workLocation}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Summary */}
        {step === 2 && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Review & Confirm</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
              <p className="font-bold">{service.name}</p>
              <p className="text-indigo-600 text-lg font-bold">₹{service.price}</p>
              <hr className="my-3" />
              <p className="text-sm text-gray-600">📅 {new Date(bookingData.scheduleTime).toLocaleString()}</p>
              <p className="text-sm text-gray-600">📍 {bookingData.workLocation}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-xl font-bold">Back</button>
              <button 
                onClick={handleBooking}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="p-10 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-gray-600 mt-2">The provider has been notified. You can track this in your dashboard.</p>
            <button onClick={onClose} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}