import React, { useEffect } from "react";
import { ArrowLeft, Briefcase, Zap, Heart, Coffee } from "lucide-react";

export default function Careers({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const jobs = [
    { title: "Senior React Engineer", location: "Remote (India)", type: "Full-Time", dept: "Engineering" },
    { title: "City Operations Manager", location: "Mumbai, MH", type: "Full-Time", dept: "Operations" },
    { title: "Trust & Safety Specialist", location: "Remote", type: "Full-Time", dept: "Support" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 font-medium mb-8 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Build the future of local commerce.</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Join a passionate team dedicated to creating economic opportunity for independent professionals everywhere.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Open Roles</h3>
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer group">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{job.title}</h4>
                <div className="flex gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Briefcase size={14}/> {job.dept}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-5 py-2 rounded-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition">Apply</button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Life at NearEase</h3>
          <div className="bg-indigo-50 dark:bg-gray-800 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium"><Zap className="text-yellow-500" size={20}/> Fast-paced & High Impact</li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium"><Heart className="text-rose-500" size={20}/> Comprehensive Healthcare</li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium"><Coffee className="text-amber-600" size={20}/> Flexible Remote Work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}