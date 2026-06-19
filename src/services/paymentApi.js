const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/payments";

const getAuthToken = () => {
  const savedUser = localStorage.getItem("nearEaseUser");
  if (savedUser) {
    try {
      return JSON.parse(savedUser).token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken(); 
  if (token) headers["Authorization"] = `Bearer ${token}`;
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

export const PaymentAPI = {
  createOrder: async (bookingId) => {
    return fetchWithAuth(`${BASE_URL}/create-order/${bookingId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
  },

  // --- THE FIX: NOW HITS THE REAL VERIFY ENDPOINT WITH THE DTO ---
  verifyPayment: async (verificationData) => {
    return fetchWithAuth(`${BASE_URL}/verify-payment`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(verificationData) // Sends the exact PaymentVerificationDto your Java expects
    });
  }
};