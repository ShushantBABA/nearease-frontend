import React, { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Loader2, UserX, MapPin, Briefcase } from "lucide-react";
import { AdminAPI } from "../services/adminApi";

export default function AdminPanel() {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    setIsLoading(true);
    try {
      const data = await AdminAPI.getPendingProviders();
      setPendingApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load pending applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    if (!window.confirm(`Are you sure you want to ${decision} this application?`)) return;
    
    setActionLoading(id);
    try {
      if (decision === "approve") {
        await AdminAPI.approveProvider(id);
      } else {
        await AdminAPI.rejectProvider(id);
      }
      // Remove the processed application from the UI instantly
      setPendingApplications(pendingApplications.filter(app => app.id !== id));
    } catch (error) {
      alert(`Failed to ${decision} provider. Please check network connection.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading admin records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
          <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Control Panel</h1>
          <p className="text-gray-500">Manage platform access and provider verifications.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          Pending Verifications
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
            {pendingApplications.length}
          </span>
        </h2>

        {pendingApplications.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
            <p className="text-gray-500">There are no pending provider applications to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-gray-50 dark:bg-gray-900/30 hover:shadow-md transition">
                
                {/* Application Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {app.user?.firstName || "Unknown User"} {app.user?.lastName || ""}
                    </h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">Awaiting Review</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{app.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <Briefcase size={16} className="text-indigo-500" /> 
                      {app.skills} ({app.experience} yrs exp)
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <MapPin size={16} className="text-red-400" /> 
                      {app.address}
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => handleDecision(app.id, "reject")}
                    disabled={actionLoading === app.id}
                    className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    {actionLoading === app.id ? <Loader2 className="animate-spin w-5 h-5" /> : <><XCircle size={18} /> Reject</>}
                  </button>
                  <button 
                    onClick={() => handleDecision(app.id, "approve")}
                    disabled={actionLoading === app.id}
                    className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl font-bold shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {actionLoading === app.id ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle size={18} /> Approve</>}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}