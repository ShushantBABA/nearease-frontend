import React, { useEffect } from "react";
import { ArrowLeft, Shield, Lock, CheckCircle2, UserCheck } from "lucide-react";

export default function TrustSafety({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 font-medium mb-8 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Shield size={40} /></div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Trust & Safety at NearEase</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Your security is the foundation of our platform. Here is how we protect every booking.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-6 items-start">
          <UserCheck className="text-indigo-600 shrink-0 mt-1" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verified Providers</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Every provider undergoes a strict verification process, including identity checks, credential verification, and portfolio reviews before they can list a service.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-6 items-start">
          <Lock className="text-emerald-600 shrink-0 mt-1" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure Escrow Payments</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Your money is safe. When you book a service, funds are securely held in escrow and only released to the provider once you provide the secure OTP confirming the job is done.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-6 items-start">
          <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authentic Reviews</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Reviews can only be left by customers who have successfully completed and paid for a service through the platform, ensuring 100% authentic feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}