const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/payments";
const getHeaders = () => ({ "Content-Type": "application/json" });

export const PaymentAPI = {
  createOrder: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/create-order/${bookingId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
    return res.json();
  },

  processPayout: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/payout/${bookingId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
    return res.json();
  },

  processRefund: async (bookingId) => {
    const res = await fetch(`${BASE_URL}/refund/${bookingId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
    return res.json();
  }
};