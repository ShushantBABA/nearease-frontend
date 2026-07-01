const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/admin";

const getAuthToken = () => {
  const savedUser = localStorage.getItem("nearEaseUser");
  if (savedUser) {
    try {
      const userObj = JSON.parse(savedUser);
      return userObj.token; 
    } catch (e) {
      console.error("Failed to parse user from local storage");
      return null;
    }
  }
  return null;
};

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken(); 
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const fetchWithAuth = async (url, options = {}) => {
  const res = await fetch(url, options);
  
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      const errorText = await res.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const AdminAPI = {
  getPendingProviders: async () => {
    return fetchWithAuth(`${BASE_URL}/provider/pending`, {
      headers: getHeaders()
    });
  },

  approveProvider: async (id) => {
    return fetchWithAuth(`${BASE_URL}/provider/approve/${id}`, {
      method: "POST",
      headers: getHeaders()
    });
  },

  rejectProvider: async (id) => {
    return fetchWithAuth(`${BASE_URL}/provider/reject/${id}`, {
      method: "POST",
      headers: getHeaders()
    });
  },

  getAllBookings: async () => {
    return fetchWithAuth(`${BASE_URL}/all/bookings`, {
      headers: getHeaders()
    });
  },

  // --- THE FIX: Updated to match the new endpoints in AdminController.java ---
  processPayout: async (bookingId) => {
    return fetchWithAuth(`${BASE_URL}/payout/${bookingId}`, {
      method: "POST",
      headers: getHeaders()
    });
  },

  processRefund: async (bookingId) => {
    return fetchWithAuth(`${BASE_URL}/refund/${bookingId}`, {
      method: "POST",
      headers: getHeaders()
    });
  }
};