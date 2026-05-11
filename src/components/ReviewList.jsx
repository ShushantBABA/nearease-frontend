import React, { useState, useEffect } from "react";
import { Star, User, Loader2 } from "lucide-react";
import { UserAPI } from "../services/userApi";

export default function ReviewList({ providerId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      UserAPI.getProviderReviews(providerId)
        .then(data => setReviews(data))
        .catch(err => console.error("Failed to load reviews", err))
        .finally(() => setIsLoading(false));
    }
  }, [providerId]);

  if (isLoading) return <Loader2 className="animate-spin text-indigo-500 mx-auto my-8" />;
  if (reviews.length === 0) return <p className="text-gray-500 italic py-4">No reviews yet. Be the first to try their service!</p>;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
      {reviews.map((review, idx) => (
        <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {review.customerName?.charAt(0) || <User size={16} />}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{review.customerName || "Customer"}</span>
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
              ))}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}