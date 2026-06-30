import React, { useState, useEffect } from "react";
import { 
  Briefcase, DollarSign, Clock, CheckCircle, MapPin, 
  Calendar, User, Loader2, Plus, TrendingUp, XCircle, 
  FileText, Trash2, Image as ImageIcon, Settings2, Edit3, Save, Tag, Star, Phone, Mail
} from "lucide-react";
import { ProviderAPI } from "../services/providerApi";
import { BookingAPI } from "../services/bookingApi";
import AddServiceModal from "./AddServiceModal";
import GoBackButton from "./GoBackButton"; 

export default function ProviderDashboard({ defaultOpenAddService = false }) {
  const [activeTab, setActiveTab] = useState("overview"); 
  const [dashboardData, setDashboardData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(defaultOpenAddService);
  
  const [hiddenIds, setHiddenIds] = useState(() => JSON.parse(localStorage.getItem("hiddenProviderBookings") || "[]"));
  
  // Job Completion States
  const [completingJobId, setCompletingJobId] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Edit Service States
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "" });
  const [editFile, setEditFile] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => { refreshDashboardData(); }, []);

  const refreshDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, requestsData] = await Promise.all([
        ProviderAPI.getDashboard().catch(() => null),
        BookingAPI.getBookingRequests().catch(() => [])
      ]);
      setDashboardData(statsData);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const statusToSend = newStatus === "ACCEPTED" ? "CONFIRMED" : newStatus;
      await BookingAPI.updateStatus(bookingId, { status: statusToSend });
      if (newStatus === "REJECTED") {
        setRequests(requests.filter(req => req.id !== bookingId));
      } else {
        setRequests(requests.map(req => req.id === bookingId ? { ...req, bookingStatus: "CONFIRMED" } : req));
      }
    } catch (error) { window.alert(`Failed to update request.`); }
  };

  const handleInitiateCompletion = async (bookingId) => {
    try {
      await BookingAPI.sendBookingOtp(bookingId);
      setCompletingJobId(bookingId);
    } catch (error) { window.alert(error.message || "Failed to send OTP to the customer."); }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length < 4) return window.alert("Please enter a valid OTP.");
    setIsSubmittingOtp(true);
    
    try {
      const formData = new FormData();
      formData.append("otp", otpCode);
      if (beforeImage) formData.append("beforeImages", beforeImage);
      if (afterImage) formData.append("afterImages", afterImage);
      
      await BookingAPI.completeBooking(completingJobId, formData);
      
      window.alert("Service successfully completed!");
      
      setRequests(requests.map(req => req.id === completingJobId ? { ...req, bookingStatus: "COMPLETED" } : req));
      
      setCompletingJobId(null); 
      setOtpCode(""); 
      setBeforeImage(null); 
      setAfterImage(null);
      
      refreshDashboardData(); 
      
    } catch (error) { 
      console.error("OTP Verification Error:", error);
      window.alert(error.message || "Invalid OTP. Please check with the customer."); 
    } finally { 
      setIsSubmittingOtp(false); 
    }
  };

  const handleDeleteCard = (id) => {
    const newHidden = [...hiddenIds, id];
    setHiddenIds(newHidden);
    localStorage.setItem("hiddenProviderBookings", JSON.stringify(newHidden));
  };

  const handleEditSubmit = async () => {
    if (!editForm.price || editForm.price <= 0) return alert("Price must be greater than 0.");
    if (!editForm.description.trim()) return alert("Description is required.");
    if (!editForm.title.trim()) return alert("Service Title is required.");
    
    setIsSubmittingEdit(true);
    try {
      const serviceRequest = {
        serviceTitle: editForm.title, 
        serviceTypeId: editingService.serviceTypeId || editingService.serviceType?.id || 1, 
        price: Number(editForm.price),
        description: editForm.description
      };

      const formData = new FormData();
      formData.append("serviceDetails", new Blob([JSON.stringify(serviceRequest)], { type: "application/json" }));
      if (editFile) formData.append("file", editFile);

      await ProviderAPI.editService(editingService.id, formData);
      alert("Service updated successfully!");
      setEditingService(null);
      refreshDashboardData(); 
    } catch (error) {
      alert(error.message || "Failed to update service.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setEditForm({ 
      title: service.serviceTitle || service.ServiceTitle || service.name || "", 
      price: service.price || "", 
      description: service.description || "" 
    });
    setEditFile(null);
  };

  const visibleRequests = requests.filter(r => !hiddenIds.includes(r.id));

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <GoBackButton />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Provider Workspace
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-700 shadow-sm">
            <Star size={16} className="fill-yellow-400 text-yellow-400 mb-0.5" />
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
              {dashboardData?.averageRating ? Number(dashboardData.averageRating).toFixed(1) : "New"}
            </span>
          </div>

          <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <Plus size={20} /> New Service
          </button>
        </div>
      </div>

      {/* --- STAT GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setActiveTab("earnings")} className={`p-6 rounded-2xl border transition-all cursor-pointer dark:bg-gray-800 hover:shadow-md ${activeTab === "earnings" ? "border-green-500 shadow-md ring-2 ring-green-100 bg-green-50/30 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-700 bg-white"}`}>
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">₹{dashboardData?.totalEarning || 0}</h3>
            </div>
          </div>
        </div>
        
        <div onClick={() => setActiveTab("completed")} className={`p-6 rounded-2xl border transition-all cursor-pointer dark:bg-gray-800 hover:shadow-md ${activeTab === "completed" ? "border-blue-500 shadow-md ring-2 ring-blue-100 bg-blue-50/30 dark:bg-blue-900/10" : "border-gray-100 dark:border-gray-700 bg-white"}`}>
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500">Completed Jobs</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{dashboardData?.completedJobs || 0}</h3>
            </div>
          </div>
        </div>

        <div onClick={() => setActiveTab("requests")} className={`p-6 rounded-2xl border transition-all cursor-pointer dark:bg-gray-800 hover:shadow-md ${activeTab === "requests" ? "border-amber-500 shadow-md ring-2 ring-amber-100 bg-amber-50/30 dark:bg-amber-900/10" : "border-gray-100 dark:border-gray-700 bg-white"}`}>
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Clock size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500">Pending Requests</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{visibleRequests.filter(r => r.bookingStatus === "PENDING").length}</h3>
            </div>
          </div>
        </div>

        {/* MY SERVICES TAB */}
        <div onClick={() => setActiveTab("services")} className={`p-6 rounded-2xl border transition-all cursor-pointer dark:bg-gray-800 hover:shadow-md ${activeTab === "services" ? "border-purple-500 shadow-md ring-2 ring-purple-100 bg-purple-50/30 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-700 bg-white"}`}>
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Settings2 size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500">Active Services</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{dashboardData?.activeServices?.length || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- MY SERVICES VIEW --- */}
      {activeTab === "services" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <Settings2 className="text-purple-600" />
            <h2 className="text-2xl font-bold dark:text-white">Manage My Services</h2>
          </div>

          {!dashboardData?.activeServices || dashboardData.activeServices.length === 0 ? (
             <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
               <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <p className="text-gray-500 font-medium">You haven't added any services yet.</p>
               <button onClick={() => setIsAddModalOpen(true)} className="mt-4 text-purple-600 font-bold hover:underline cursor-pointer">Create your first service</button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.activeServices.map((service) => (
                <div key={service.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-300"><ImageIcon size={48} /></div>
                    )}
                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg text-purple-600 dark:text-purple-400">
                      {service.categoryName || "Service"}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{service.name || service.serviceTitle}</h3>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{service.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1">
                      {service.description}
                    </p>
                    
                    <button 
                      onClick={() => openEditModal(service)}
                      className="w-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                    >
                      <Edit3 size={18} /> Update Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- EDIT SERVICE MODAL --- */}
      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-2xl rounded-[2rem] p-8 max-w-lg w-full relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setEditingService(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white z-10 transition-colors cursor-pointer">
              <XCircle size={28} />
            </button>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-purple-600 dark:text-purple-400">
                <Edit3 size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Edit Service</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-8">Update the details for "{editingService.name || editingService.serviceTitle}".</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5 ml-1">
                    <FileText size={14}/> Service Title
                  </label>
                  <input 
                    type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="e.g., Premium Home Deep Cleaning"
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent px-4 py-3 rounded-xl outline-none transition font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5 ml-1">
                    <Tag size={14}/> Price (₹)
                  </label>
                  <input 
                    type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent px-4 py-3 rounded-xl outline-none transition font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5 ml-1">
                    <FileText size={14}/> Description
                  </label>
                  <textarea 
                    value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={4}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent px-4 py-3 rounded-xl outline-none transition font-medium resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5 ml-1">
                    <ImageIcon size={14}/> Update Cover Image (Optional)
                  </label>
                  <input 
                    type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-1 cursor-pointer" 
                  />
                </div>

                <button 
                  onClick={handleEditSubmit} disabled={isSubmittingEdit} 
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-extrabold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 flex justify-center items-center gap-2 mt-4 cursor-pointer"
                >
                  {isSubmittingEdit ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20}/> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EARNINGS HISTORY PASSBOOK --- */}
      {activeTab === "earnings" && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shadow-inner">
                <DollarSign size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black dark:text-white">Earnings Passbook</h2>
                <p className="text-sm font-medium text-gray-500">Your completed job transaction history</p>
              </div>
            </div>
            <div className="text-left md:text-right">
               <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Net Earnings</p>
               <h3 className="text-4xl font-black text-green-600 dark:text-green-400">₹{dashboardData?.totalEarning || 0}</h3>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.filter(req => req.bookingStatus === "COMPLETED").length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No transaction history yet.</p>
              </div>
            ) : (
              [...requests]
                .filter(req => req.bookingStatus === "COMPLETED")
                .sort((a, b) => new Date(b.scheduledTime || b.scheduleTime) - new Date(a.scheduledTime || a.scheduleTime))
                .map((job) => {
                  const grossAmount = job.price || job.serviceOffering?.price || 0;
                  
                  return (
                    <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform shrink-0">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{job.ServiceName || job.serviceOffering?.name || job.serviceOffering?.serviceTitle || "Service Payout"}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium mt-1.5">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-indigo-400" /> {new Date(job.scheduledTime || job.scheduleTime).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-indigo-400" /> {new Date(job.scheduledTime || job.scheduleTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-1"><User size={12} className="text-indigo-400" /> {job.customer?.firstName} {job.customer?.lastName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-black text-green-600 dark:text-green-400">+₹{grossAmount}</p>
                        <span className={`inline-block mt-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${job.paymentStatus === "TRANSFER_TO_PROVIDER" ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                           {job.paymentStatus === "TRANSFER_TO_PROVIDER" ? "Settled" : "Escrow / Pending"}
                        </span>
                      </div>
                    </div>
                  );
              })
            )}
          </div>
        </div>
      )}

      {/* --- REQUESTS & HISTORY TABS --- */}
      {(activeTab === "requests" || activeTab === "completed" || activeTab === "overview") && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-xl font-bold dark:text-white">{activeTab === "completed" ? "Job History" : "Active Service Requests"}</h2>
          
          {visibleRequests.filter(job => activeTab === "completed" ? job.bookingStatus === "COMPLETED" : job.bookingStatus !== "COMPLETED").length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"><Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">No requests to display.</p></div>
          ) : (
            visibleRequests
              .filter(job => activeTab === "completed" ? job.bookingStatus === "COMPLETED" : job.bookingStatus !== "COMPLETED")
              .map((job) => {
                const note = job.CostumerRequest || job.customerRequest || job.note;
                const providerCost = job.price || job.serviceOffering?.price || 0;

                return (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 relative">
                  
                  <button onClick={() => handleDeleteCard(job.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 hover:bg-red-100 rounded-full shadow-sm cursor-pointer" title="Delete from dashboard">
                    <Trash2 size={18} />
                  </button>

                  <div className="flex justify-between items-start mb-4 pr-12">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.ServiceName || job.serviceOffering?.name || job.serviceOffering?.serviceTitle || "Service Requested"}</h3>
                      <p className="text-sm font-mono text-gray-500 mt-1">Booking ID: #{job.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹{providerCost}</p>
                      <span className="inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {job.bookingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                      <span><strong className="text-gray-800 dark:text-gray-200">Time:</strong> <br/>{new Date(job.scheduledTime || job.scheduleTime).toLocaleString()}</span>
                    </p>
                    
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                      <span><strong className="text-gray-800 dark:text-gray-200">Location:</strong> <br/>{job.workLocation || "N/A"}</span>
                    </p>
                    
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                      <span><strong className="text-gray-800 dark:text-gray-200">Customer Name:</strong> <br/>{job.customer?.firstName} {job.customer?.lastName}</span>
                    </p>
                    
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                      <span><strong className="text-gray-800 dark:text-gray-200">Phone Number:</strong> <br/>{job.customer?.phone || "Not Provided"}</span>
                    </p>
                    
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 sm:col-span-2 lg:col-span-1">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                      <span className="break-all"><strong className="text-gray-800 dark:text-gray-200">Email Address:</strong> <br/>{job.customer?.email || "Not Provided"}</span>
                    </p>
                    
                    {note && (
                      <p className="flex items-start gap-2 text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg md:col-span-2 mt-2">
                        <FileText className="w-4 h-4 mt-0.5 shrink-0" /> 
                        <span><strong>Customer's Note:</strong> <br/>{note}</span>
                      </p>
                    )}
                  </div>

                  {job.bookingStatus === "COMPLETED" && (job.beforeImages || job.afterImages) && (
                    <div className="mt-6 pt-5 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <ImageIcon size={16} className="text-indigo-500" /> Proof of Work Gallery
                      </h4>
                      <div className="flex gap-4">
                        {job.beforeImages && (
                          <div onClick={() => setPreviewImage(job.beforeImages)} className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group shadow-sm">
                            <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase px-2 py-0.5 rounded z-10 font-black tracking-widest">Before</span>
                            <img src={job.beforeImages} alt="Before" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                        )}
                        {job.afterImages && (
                          <div onClick={() => setPreviewImage(job.afterImages)} className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group shadow-sm">
                            <span className="absolute top-1 left-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] uppercase px-2 py-0.5 rounded z-10 font-black tracking-widest">After</span>
                            <img src={job.afterImages} alt="After" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {job.bookingStatus === "PENDING" && (
                    <div className="flex gap-4 pt-2 mt-4">
                      <button onClick={() => handleStatusChange(job.id, "ACCEPTED")} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition cursor-pointer">Accept Request</button>
                      <button onClick={() => handleStatusChange(job.id, "REJECTED")} className="flex-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 py-3 rounded-xl font-bold hover:bg-red-100 transition cursor-pointer">Reject Request</button>
                    </div>
                  )}

                  {/* --- FLEXIBLE FLOW: ALLOW COMPLETION WITHOUT PAYMENT CHECK --- */}
                  {(job.bookingStatus === "CONFIRMED" || job.bookingStatus === "ACCEPTED") && (
                    <div className="pt-2 mt-4">
                      <button onClick={() => handleInitiateCompletion(job.id)} className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition flex justify-center items-center gap-2 shadow-sm cursor-pointer">
                        <CheckCircle size={20} /> Mark as Complete
                      </button>
                      {/* Note for the provider if payment hasn't been collected yet */}
                      {job.paymentStatus !== "PAID_TO_PLATFORM" && (
                         <p className="text-center text-xs text-amber-600 mt-3 font-medium">Customer can pay before or after the completion of the service.</p>
                      )}
                    </div>
                  )}
                </div>
              )})
          )}
        </div>
      )}

      {/* --- RESTORED COMPLETION MODAL WITH IMAGE UPLOADS --- */}
      {completingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 shadow-2xl rounded-3xl p-8 max-w-sm w-full relative overflow-hidden animate-in zoom-in-95">
              
              <button 
                onClick={() => { setCompletingJobId(null); setBeforeImage(null); setAfterImage(null); setOtpCode(""); }} 
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 dark:hover:text-white z-10 transition cursor-pointer"
              >
                <XCircle size={24} />
              </button>
              
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckCircle className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Complete Service</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enter the customer's OTP and upload your portfolio proof.</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Customer OTP</label>
                  <input 
                    type="text" placeholder="0000" 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value)} 
                    className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-black border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl outline-none focus:border-indigo-500 transition shadow-inner dark:text-white" 
                    maxLength={6} 
                  />
                </div>

                {/* Before Image */}
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Before Image <span className="text-gray-400 lowercase font-medium">(Optional)</span></label>
                  <input 
                    type="file" accept="image/*" 
                    onChange={(e) => setBeforeImage(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition border border-gray-200 dark:border-gray-700 rounded-xl p-1 bg-white dark:bg-gray-800 cursor-pointer" 
                  />
                </div>

                {/* After Image */}
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">After Image <span className="text-green-500 lowercase font-medium">(Builds Portfolio)</span></label>
                  <input 
                    type="file" accept="image/*" 
                    onChange={(e) => setAfterImage(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition border border-gray-200 dark:border-gray-700 rounded-xl p-1 bg-white dark:bg-gray-800 cursor-pointer" 
                  />
                </div>
              </div>

              <button 
                onClick={handleOtpSubmit} 
                disabled={isSubmittingOtp} 
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:bg-indigo-700 transition flex justify-center items-center gap-2 cursor-pointer"
              >
                {isSubmittingOtp ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle size={18}/> Verify & Complete</>}
              </button>
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full z-10 cursor-pointer"><XCircle size={32} /></button>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <AddServiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => refreshDashboardData()} />
    </div>
  );
}