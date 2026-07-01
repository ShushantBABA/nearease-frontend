import React, { useState } from "react";
import { ArrowLeft, MapPin, Calendar, FileText, CheckCircle, Loader2, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { BookingAPI } from "../services/bookingApi"; 

export default function CheckoutPage({ service, onBack, onComplete }) {
  const [formData, setFormData] = useState({
    scheduleTime: "",
    workLocation: "",
    customerRequest: "",
    city: "Default City", 
    state: "Default State",
    pinCode: "000000"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  // 1. THE FIX: Removed platform fee. Total cost is now strictly the service price.
  const servicePrice = service?.price || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const bookingPayload = {
        serviceOfferingId: service.id,
        scheduleTime: new Date(formData.scheduleTime).toISOString(),
        workLocation: formData.workLocation,
        customerRequest: formData.customerRequest,
        city: formData.city,
        state: formData.state,
        pinCode: parseInt(formData.pinCode),
        totalPrice: servicePrice // Passed the exact service price to the backend
      };

      const response = await BookingAPI.bookService(bookingPayload);
      setSuccessData({ bookingId: response.id || Math.floor(Math.random() * 10000) });
    } catch (err) {
      window.alert(err.message || "Failed to send service request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PREMIUM SUCCESS STATE ---
  if (successData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-500 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-green-500/20 to-transparent"></div>
          
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] relative z-10">
            <CheckCircle className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Request Sent!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Your booking has been forwarded to the provider. You will be notified once they accept the job.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700 text-left flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">#{successData.bookingId}</p>
            </div>
            <ShieldCheck className="text-green-500 w-8 h-8 opacity-50" />
          </div>
          
          <button onClick={onComplete} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-1 text-lg">
            Track My Booking
          </button>
        </div>
      </div>
    );
  }

  // --- UPGRADED SPLIT-SCREEN UI ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-8 font-bold group">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-md transition border border-gray-200 dark:border-gray-700">
            <ArrowLeft size={18} />
          </div>
          Back to Service details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Premium Service Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 animate-in slide-in-from-left-8 fade-in duration-700">
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
                <p className="text-indigo-200 font-bold text-sm tracking-widest uppercase mb-2">Booking Summary</p>
                <h1 className="text-3xl font-black leading-tight">
                  {service?.name || service?.serviceType?.name || "Premium Service"}
                </h1>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                       <ShieldCheck size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white text-lg">Verified Provider</h3>
                       <p className="text-gray-500 dark:text-gray-400 text-sm">{service?.provider?.name || "NearEase Certified Professional"}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                       <CreditCard size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white text-lg">No Upfront Payment</h3>
                       <p className="text-gray-500 dark:text-gray-400 text-sm">You only pay after the provider accepts your request.</p>
                     </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">Total Service Cost</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white">₹{servicePrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Enhanced Form */}
          <div className="lg:col-span-7 animate-in slide-in-from-right-8 fade-in duration-700">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Service Details</h2>
              
              {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 flex items-center gap-3"><AlertCircle size={20}/> {error}</div>}

              <div className="space-y-6">
                
                {/* 2. ENHANCED COMPONENT: Modern Date/Time Widget */}
                <div className="group relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-5">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">
                    When do you need this?
                  </label>
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-indigo-500 shrink-0">
                       <Calendar size={24} />
                     </div>
                     <input 
                        type="datetime-local" 
                        required
                        className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-bold text-lg sm:text-xl placeholder-gray-300 dark:placeholder-gray-600 cursor-pointer"
                        onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                     />
                  </div>
                </div>

                {/* ENHANCED COMPONENT: Modern Location Widget */}
                <div className="group relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-5">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">
                    Where is the service location?
                  </label>
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-purple-500 shrink-0">
                       <MapPin size={24} />
                     </div>
                     <input 
                        type="text" 
                        required 
                        placeholder="House No, Street, Landmark..."
                        className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-bold text-lg sm:text-xl placeholder-gray-400 dark:placeholder-gray-500"
                        onChange={(e) => setFormData({...formData, workLocation: e.target.value})}
                     />
                  </div>
                </div>

                {/* ENHANCED COMPONENT: Modern Textarea Widget */}
                <div className="group relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-5">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">
                    Special Instructions (Optional)
                  </label>
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-blue-500 shrink-0 mt-1">
                       <FileText size={24} />
                     </div>
                     <textarea 
                        rows="3" 
                        placeholder="Any specific instructions for the provider to know beforehand?"
                        className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-base resize-none placeholder-gray-400 dark:placeholder-gray-500 pt-3"
                        onChange={(e) => setFormData({...formData, customerRequest: e.target.value})}
                     />
                  </div>
                </div>

              </div>

              <div className="pt-10">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] flex justify-center items-center gap-3 disabled:opacity-70 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin w-6 h-6" /> Processing...</>
                  ) : (
                    <>Confirm Request — ₹{servicePrice}</>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 font-medium">
                  <Clock size={16} /> Fast Confirmation <span className="mx-2 text-gray-300">•</span> <ShieldCheck size={16} /> Secure Platform
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}