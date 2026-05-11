const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const PROVIDER_URL = `${BASE_URL}/api/provider`;
const getHeaders = () => ({ "Content-Type": "application/json" });

export const ProviderAPI = {
  // Apply to become a provider
  apply: async (applicationData) => {
    const res = await fetch(`${PROVIDER_URL}/apply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(applicationData), // { bio, skills, experience, address }
    });
    return res.json();
  },

  // Add a new service offering
  addService: async (serviceData) => {
    const res = await fetch(`${PROVIDER_URL}/addService`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(serviceData), // { serviceTypeId, price, description, image }
    });
    return res.json();
  },

  // Get Provider Dashboard stats
  getDashboard: async () => {
    const res = await fetch(`${PROVIDER_URL}/my/DashBoard`, { headers: getHeaders() });
    return res.json();
  },

  // Portfolio Management
  getMyPortfolio: async () => {
    const res = await fetch(`${PROVIDER_URL}/my-portfolio`, { headers: getHeaders() });
    return res.json();
  },

  deletePortfolioImage: async (bookingId) => {
    const res = await fetch(`${PROVIDER_URL}/my-portfolio/${bookingId}/images`, { 
      method: "DELETE", 
      headers: getHeaders() 
    });
    return res.json();
  },

  // Admin Route: Approve a provider
  approveProvider: async (providerId) => {
    const res = await fetch(`${BASE_URL}/api/admin/provider/approve/${providerId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
    return res.json();
  }
};