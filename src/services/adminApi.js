const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/admin";

export const AdminAPI = {
  // Fetch applications that need review
  getPendingProviders: async () => {
    // Note: You will likely need to pass your admin JWT token in headers here
    const res = await fetch(`${BASE_URL}/provider/pending`, {
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },

  // Approve a specific provider
  approveProvider: async (id) => {
    const res = await fetch(`${BASE_URL}/provider/approve/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },

  // Reject a provider (Optional but recommended)
  rejectProvider: async (id) => {
    const res = await fetch(`${BASE_URL}/provider/reject/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  }
};