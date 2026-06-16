const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const PublicAPI = {
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/categories/`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json(); 
    } catch (error) {
      return [];
    }
  },

  getTypesByCategory: async (categoryName) => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/categories/${categoryName}/types`);
      if (!response.ok) throw new Error("Failed to fetch types");
      return await response.json(); 
    } catch (error) {
      return [];
    }
  },

  getAllOfferings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/services/all`);
      if (!response.ok) throw new Error("Failed to fetch all services");
      return await response.json(); 
    } catch (error) {
      return [];
    }
  },

  getOfferingsByType: async (typeId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/type/${typeId}/offering`);
      if (!response.ok) throw new Error("Failed to fetch offerings");
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  getProviderPortfolio: async (providerId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/providers/${providerId}/portfolio`);
      if (!response.ok) throw new Error("Failed to fetch portfolio");
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  // --- THE FIX: ADDED MISSING REVIEW ENDPOINT ---
  getProviderReviews: async (providerId) => {
    try {
      // Changed the URL to match your existing ReviewController mapping!
      const response = await fetch(`${BASE_URL}/api/reviews/provider/${providerId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in getProviderReviews:", error);
      return [];
    }
  }
};