import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Star, MapPin, CheckCircle, ShieldCheck, 
  Clock, CreditCard, ChevronRight, MessageSquare, Loader2, Image as ImageIcon
} from "lucide-react";
import { PublicAPI } from "../services/publicApi";

export default function ServicePage({ service, onBack, onProceedToCheckout, onLoginRedirect }) {
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchPageData = async () => {
      setIsLoadingData(true);
      const providerId = service?.provider?.id || service?.providerProfile?.id;
      const serviceId = service?.id;

      try {
        let fetchedReviews = [];
        if (typeof PublicAPI.getServiceReviews === "function") {
          fetchedReviews = await PublicAPI.getServiceReviews(serviceId);
        } else if (typeof PublicAPI.getProviderReviews === "function") {
          fetchedReviews = await PublicAPI.getProviderReviews(providerId);
        } else if (typeof PublicAPI.getReviews === "function") {
          fetchedReviews = await PublicAPI.getReviews(serviceId);
        }
        setReviews(Array.isArray(fetchedReviews) ? fetchedReviews : []);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }

      if (providerId) {
        try {
          const fetchedPortfolio = await PublicAPI.getProviderPortfolio(providerId);
          setPortfolio(Array.isArray(fetchedPortfolio) ? fetchedPortfolio : []);
        } catch (error) {
          console.error("Failed to fetch portfolio", error);
        }
      }
      
      setIsLoadingData(false);
    };
    
    fetchPageData();
  }, [service]);

  if (!service) return null;

  const safeGetUser = () => {
    try { return JSON.parse(localStorage.getItem("nearEaseUser")) || null; } 
    catch { return null; }
  };
  const user = safeGetUser();

  const provider = service.provider || service.providerProfile || {};
  const providerName = String(provider.firstName ? `${provider.firstName} ${provider.lastName || ''}`.trim() : (provider.name || "Professional Provider"));
  const providerInitial = providerName.charAt(0).toUpperCase();

  const avgRating = Number(provider.averageRating || service.averageRating || 0);
  const hasRating = !isNaN(avgRating) && avgRating > 0;
  
  const rawJobsCount = Number(provider.completedJobs || 0);
  const displayJobs = rawJobsCount > 0 ? rawJobsCount : (portfolio.length > 0 ? portfolio.length : (reviews.length > 0 ? reviews.length : 0));

  const safeTitle = String(service.serviceTitle || service.ServiceTitle || service.name || service.serviceType?.name || "Professional Service");
  const safeCategory = String(service.serviceTypename || service.serviceType?.name || "Service");

  // --- FIX 1: BULLETPROOF IDENTITY CHECK ---
  const isOwnService = (() => {
    if (!user || !provider) return false;
    
    const uId = String(user.id);
    const pId = String(provider.id);
    
    return (
      uId === String(provider.userId) || 
      uId === String(provider.user?.id) || 
      String(user.providerId) === pId ||
      (user.email && (user.email === provider.email || user.email === provider.user?.email)) ||
      // Fallback: If they are a provider and the names match
      (user.roles?.includes("PROVIDER") && providerName.toLowerCase().includes((user.firstName || "").toLowerCase()))
    );
  })();

  const handleBooking = () => {
    if (!user) {
      onLoginRedirect();
      return;
    }
    if (!isOwnService) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-gray-900 overflow-hidden">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={safeTitle} className="w-full h-full object-cover opacity-70" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-900 to-purple-800 opacity-90"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-full p-4 sm:p-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center z-10">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full font-bold transition-all cursor-pointer border border-white/20"
          >
            <ArrowLeft size={18} /> Back to Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  {safeCategory}
                </span>
                
                {hasRating ? (
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold border border-yellow-100 dark:border-yellow-800/50">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span>{avgRating.toFixed(1)}</span>
                    <span className="text-gray-400 dark:text-gray-500 font-medium ml-1">({reviews.length || provider.reviewCount || 0} reviews)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-sm font-bold border border-amber-100 dark:border-amber-800/50">
                    <Star size={14} className="text-amber-500" />
                    New Provider
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {safeTitle}
              </h1>
              
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-lg mb-8 font-medium">
                <MapPin size={20} className="text-indigo-500 shrink-0" />
                <span className="truncate">{String(service.location || provider.city || provider.address || "Location unavailable")}</span>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this service</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {String(service.description || "No description provided.")}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Meet Your Professional</h3>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-gray-800 shadow-lg">
                  {provider.imageUrl ? (
                    <img src={provider.imageUrl} alt={providerName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black">{providerInitial}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{providerName}</h4>
                    {provider.verified && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-full" title="Verified Provider">
                        <ShieldCheck size={18} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
                    {displayJobs > 0 && (
                      <div className="flex items-center gap-1.5">
                         <CheckCircle size={16} className="text-green-500" /> {displayJobs} Jobs Completed
                      </div>
                    )}
                    {provider.experience && (
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                         {String(provider.experience)} Experience
                      </div>
                    )}
                  </div>
                  
                  {provider.bio && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-indigo-100 dark:border-indigo-900/50 pl-4 py-1">
                      "{String(provider.bio)}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- FIX 2: PORTFOLIO IMAGE RENDERING --- */}
            {portfolio.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="text-indigo-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Work Portfolio</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolio.map((item, idx) => {
                    // This safely grabs the URL whether the API returned a raw string OR an object!
                    const imgSrc = typeof item === 'string' 
                      ? item 
                      : (item?.afterImages || item?.beforeImages || item?.imageUrl || item?.image);

                    // Skip rendering if there is no valid URL found
                    if (!imgSrc) return null;

                    return (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm bg-gray-100 dark:bg-gray-900">
                        <img 
                          src={imgSrc} 
                          alt="Portfolio Work" 
                          // If the image link is dead/expired on the server, this hides the broken icon
                          onError={(e) => { e.target.style.display = 'none'; }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white font-bold text-sm tracking-wide">Verified Work</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>
              
              {isLoadingData ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" /></div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to book and review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, idx) => {
                    const revRating = Number(review.rating || 0);
                    const revInitial = String(review.customerName || "U").charAt(0).toUpperCase();
                    
                    return (
                    <div key={review.id || idx} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full flex items-center justify-center font-black shrink-0">
                            {revInitial}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-900 dark:text-white">{String(review.customerName || "Verified Customer")}</h5>
                            <p className="text-xs text-gray-500">{review.bookingDate ? new Date(review.bookingDate).toLocaleDateString() : ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">{revRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">"{String(review.comment || "")}"</p>
                      
                      {review.providerReply && (
                        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-indigo-50 dark:border-indigo-900/30 flex gap-3 shadow-sm">
                          <MessageSquare className="text-indigo-400 mt-1 shrink-0" size={18} />
                          <div>
                            <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Provider Response</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{String(review.providerReply)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              )}
            </div>
            
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 sticky top-28">
              <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Service Total</h3>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-6">
                ₹{Number(service.price || 0)}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                  <span className="text-sm font-medium">NearEase Escrow Protection included.</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <Clock className="text-blue-500 shrink-0" size={24} />
                  <span className="text-sm font-medium">Schedule exactly when you need it.</span>
                </div>
              </div>

              {isOwnService ? (
                <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 cursor-not-allowed border border-dashed border-gray-300 dark:border-gray-600">
                   This is your own service
                </div>
              ) : (
                <button 
                  onClick={handleBooking}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/30 flex justify-center items-center gap-2 transform hover:-translate-y-1 cursor-pointer"
                >
                  Proceed to Booking <ChevronRight size={20} />
                </button>
              )}
              
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  You will be prompted to login to secure your booking.
                </p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}