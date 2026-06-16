import React, { useState, useEffect } from "react";
import { Star, MapPin, Eye, ArrowRight, Loader2 } from "lucide-react";
import { PublicAPI } from "../services/publicApi"; // Ensure this path matches your folder structure

export default function ServiceCard({ item, onCardClick, onPreviewClick, service }) {
  const [calculatedRating, setCalculatedRating] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  // --- THE NEW LOGIC: FETCH AND CALCULATE ON THE FLY ---
  useEffect(() => {
    let isMounted = true;

    const fetchAndCalculateRating = async () => {
      // Find the provider ID to fetch their specific reviews
      const providerId = item?.provider?.id || item?.providerProfile?.id || service?.provider?.id;
      
      if (!providerId) {
        if (isMounted) setIsCalculating(false);
        return;
      }

      try {
        if (typeof PublicAPI.getProviderReviews === "function") {
          const fetchedReviews = await PublicAPI.getProviderReviews(providerId);
          
          if (isMounted) {
            if (Array.isArray(fetchedReviews) && fetchedReviews.length > 0) {
              // Same exact math logic from your ServicePage
              const total = fetchedReviews.reduce((acc, rev) => acc + Number(rev.rating || 0), 0);
              setCalculatedRating(total / fetchedReviews.length);
            } else {
              setCalculatedRating(0); // No reviews = 0 rating
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch reviews for card:", error);
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    };

    fetchAndCalculateRating();

    return () => { isMounted = false; }; // Cleanup to prevent memory leaks
  }, [item, service]);

  if (!item) return null;

  // --- BULLETPROOF DATA EXTRACTION ---
  const provider = item.provider || item.providerProfile || {};
  
  // Use our new dynamically calculated rating
  const hasRating = !isNaN(calculatedRating) && calculatedRating > 0;

  const safeTitle = String(item.serviceTitle || item.name || item.serviceType?.name || "Professional Service");
  const safeCategory = String(item.serviceTypename || item.serviceType?.name || item.categoryName || "Service");
  const safeLocation = String(item.location || provider.city || provider.address || "Location unavailable");
  const safeInitial = safeTitle.charAt(0).toUpperCase() || "S";
  
  const price = item.price || 0;
  const imageUrl = item.imageUrl || service?.imageUrl || item.image;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
      
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={safeTitle} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-gray-800">
             <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center">
                <span className="text-3xl font-black text-indigo-300 dark:text-gray-500">
                   {safeInitial}
                </span>
             </div>
          </div>
        )}
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-10">
           <span className="bg-indigo-50/95 dark:bg-indigo-900/90 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl text-indigo-600 dark:text-indigo-300 shadow-sm border border-indigo-100/20">
             {safeCategory}
           </span>
        </div>

        {/* Quick Preview Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); if(onPreviewClick) onPreviewClick(item); }}
          className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px] cursor-pointer"
        >
          <span className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            <Eye size={18} /> Quick Look
          </span>
        </button>
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => onCardClick && onCardClick(item)}>
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-xl leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {safeTitle}
          </h3>
          
          {/* --- DYNAMIC RATING BADGE --- */}
          {isCalculating ? (
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm mt-0.5">
              <Loader2 size={14} className="text-gray-400 animate-spin" />
            </div>
          ) : hasRating ? (
            <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-xl shrink-0 border border-yellow-200 dark:border-yellow-800/50 shadow-sm mt-0.5">
              <Star size={14} className="fill-yellow-500 text-yellow-500 mb-0.5" />
              <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">
                {calculatedRating.toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-xl shrink-0 border border-orange-200 dark:border-orange-800/50 shadow-sm mt-0.5">
              <Star size={14} className="text-orange-500 mb-0.5" />
              <span className="font-bold text-orange-700 dark:text-orange-400 text-sm">
                New
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <MapPin size={18} className="text-gray-400 shrink-0" />
          <span className="truncate">{safeLocation}</span>
        </div>
        
        {/* Footer Area */}
        <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
              Starting From
            </span>
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              ₹{Number(price)}
            </span>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <ArrowRight size={22} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}