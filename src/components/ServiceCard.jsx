import React from "react";
import { Star, MapPin, Eye, ArrowRight } from "lucide-react";

export default function ServiceCard({ item, onCardClick, onPreviewClick }) {
  if (!item) return null;

  // --- BULLETPROOF DATA SANITIZATION ---
  const provider = item.provider || item.providerProfile || {};
  
  // const rawRating = provider.averageRating || item.averageRating || 0;
  const avgRating = Number(service?.averageRating || 0);
  const hasRating = !isNaN(avgRating) && avgRating > 0;
  
  const safeTitle = String(item.serviceTitle || item.name || item.serviceType?.name || "Professional Service");
  const safeCategory = String(item.serviceTypename || item.serviceType?.name || "Service");
  const safeInitial = safeTitle.charAt(0).toUpperCase() || "S";
  const safeLocation = String(item.location || provider.city || provider.address || "Location unavailable");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
      
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={safeTitle} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-gray-800">
             <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center">
                <span className="text-2xl font-black text-indigo-200 dark:text-gray-500">
                   {safeInitial}
                </span>
             </div>
          </div>
        )}
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-10">
           <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/20">
             {safeCategory}
           </span>
        </div>

        {/* Quick Preview Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPreviewClick(item); }}
          className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px] cursor-pointer"
        >
          <span className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            <Eye size={18} /> Quick Look
          </span>
        </button>
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => onCardClick(item)}>
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {safeTitle}
          </h3>
          
          {hasRating ? (
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-lg shrink-0 border border-yellow-100 dark:border-yellow-800/50">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">
                {avgRating.toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg shrink-0 border border-amber-100 dark:border-amber-800/50">
              <Star size={12} className="text-amber-500" />
              <span className="font-bold text-amber-700 dark:text-amber-400 text-xs">New</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <MapPin size={16} className="text-gray-400 shrink-0" />
          <span className="truncate">{safeLocation}</span>
        </div>
        
        {/* Footer Area */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Starting from</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">₹{Number(item.price || 0)}</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}