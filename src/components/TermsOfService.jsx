import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 font-medium mb-8 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 prose prose-indigo dark:prose-invert max-w-none">
        <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: June 15, 2026</p>

        <h3 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">By accessing and using the NearEase platform, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Description of Service</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">NearEase provides an online marketplace connecting independent service providers with customers. We do not provide the services directly, but facilitate the booking and secure payment process.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. User Obligations</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Users agree to provide accurate information during registration, maintain the security of their account credentials, and comply with all local laws and regulations while utilizing our platform.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">4. Payments and Escrow</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Payments are held in a secure escrow system. Funds are released to the provider only upon successful completion of the service, verified by the customer's OTP mechanism.</p>
      </div>
    </div>
  );
}