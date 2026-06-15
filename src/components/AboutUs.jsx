import React, { useEffect } from "react";
import { ArrowLeft, Target, Users, ShieldCheck } from "lucide-react";

export default function AboutUs({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 font-medium mb-8 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Empowering Local Communities</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          At NearEase, we believe that finding reliable, high-quality local services should be as simple as sending a text. We are building the bridge between skilled professionals and the people who need them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6"><Target size={32} /></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-400">To organize the world's local workforce and make it universally accessible and secure.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6"><Users size={32} /></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Community First</h3>
          <p className="text-gray-600 dark:text-gray-400">We empower independent professionals to grow their businesses while serving their neighbors.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShieldCheck size={32} /></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Uncompromising Quality</h3>
          <p className="text-gray-600 dark:text-gray-400">Every provider is vetted, and every transaction is secured by our escrow platform.</p>
        </div>
      </div>
    </div>
  );
}