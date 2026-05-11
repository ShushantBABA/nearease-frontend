const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 1. Standard headers for JSON requests
const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token"); // Adjust if you store your token differently
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// 2. Auth headers ONLY (Used for image uploads so we don't break FormData)
const getAuthHeadersOnly = () => {
  const headers = {};
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// 3. Helper to handle responses and throw actual errors for your React catch blocks
const fetchWithAuth = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const UserAPI = {
  // --- USER CONTROLLER ---
  updateDetails: async (details) => {
    return fetchWithAuth(`${BASE_URL}/api/user-update/update-details`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(details)
    });
  },
  
  changePassword: async (passwordData) => {
    return fetchWithAuth(`${BASE_URL}/api/user-update/changePassword`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(passwordData)
    });
  },

  updateProfileImage: async (formData) => {
    return fetchWithAuth(`${BASE_URL}/api/user-update/profile-image`, {
      method: "POST", 
      headers: getAuthHeadersOnly(), // Sends token, but lets browser handle Content-Type
      body: formData
    });
  },

  requestEmailUpdate: async (emailData) => {
    return fetchWithAuth(`${BASE_URL}/api/user-update/request-email-update`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(emailData)
    });
  },

  verifyEmailUpdate: async (verificationData) => {
    return fetchWithAuth(`${BASE_URL}/api/user-update/verify-email-update`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(verificationData)
    });
  },

  // --- REVIEW CONTROLLER ---
  submitReview: async (reviewData) => {
    return fetchWithAuth(`${BASE_URL}/api/reviews/new/review`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(reviewData)
    });
  },

  getMyReviews: async () => {
    return fetchWithAuth(`${BASE_URL}/api/reviews/my-reviews`, { 
      headers: getHeaders() 
    });
  },

  getProviderReviews: async (providerId) => {
    return fetchWithAuth(`${BASE_URL}/api/reviews/provider/${providerId}`, { 
      headers: getHeaders() 
    });
  },

  // --- MISC CONTROLLERS ---
  uploadImage: async (formData) => {
    return fetchWithAuth(`${BASE_URL}/api/images/upload`, {
      method: "POST",
      headers: getAuthHeadersOnly(), 
      body: formData 
    });
  },

  globalSearch: async (searchParams) => {
    return fetchWithAuth(`${BASE_URL}/api/services/search`, {
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(searchParams)
    });
  }
};