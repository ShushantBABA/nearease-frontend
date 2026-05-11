import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2, Calendar } from "lucide-react";
import { UserAPI } from "../services/userApi"; // Adjust path if needed

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const data = await UserAPI.getMyReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch my reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
          <p className="text-gray-500">A history of feedback you've left for providers.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
          <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews written yet</h3>
          <p className="text-gray-500">After you complete a booking, you can leave a review to help others.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                
                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {review.serviceOffering?.name || "Service"}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                    Provider: {review.provider?.name || "Unknown Provider"}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < review.rating ? "fill-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{review.rating}.0</span>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-700 mb-4" />

              {/* Review Comment */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{review.comment}"
              </p>

              {review.createdAt && (
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}