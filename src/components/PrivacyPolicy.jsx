import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 font-medium mb-8 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 prose prose-indigo dark:prose-invert max-w-none">
        <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: June 15, 2026</p>

        <h3 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">We collect information you provide directly to us, including your name, email address, phone number, location data, and transaction history to facilitate the booking process.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">We use the information we collect to operate, maintain, and improve our services. We also use it to communicate with you, process secure payments, and protect against fraudulent activity.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. Data Sharing</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">We do not sell your personal data. We only share necessary information (like service location) with verified providers so they can complete your requested booking.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">4. Security</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      </div>
    </div>
  );
}