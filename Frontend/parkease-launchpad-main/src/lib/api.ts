const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to make API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["x-auth-token"] = token;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }

  return response;
};

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    vehicleNumber: string;
    vehicleType: string;
    phone: string;
  }) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    const response = await apiRequest("/auth/profile");
    return response.json();
  },

  getDashboard: async () => {
    const response = await apiRequest("/auth/dashboard");
    return response.json();
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await apiRequest("/user/profile");
    return response.json();
  },

  getVehicle: async () => {
    const response = await apiRequest("/user/vehicle");
    return response.json();
  },
};

// Slot API
export const slotAPI = {
  getAll: async () => {
    const response = await apiRequest("/slots/all");
    return response.json();
  },
  getSummary: async () => {
    const response = await apiRequest("/slots/summary");
    return response.json();
  },
  book: async (id: string) => {
    const response = await apiRequest(`/slots/book/${id}`, { method: "POST" });
    return response.json();
  },
  release: async (id: string) => {
    const response = await apiRequest(`/slots/release/${id}`, { method: "POST" });
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await apiRequest("/admin/dashboard");
    return response.json();
  },

  addSlot: async (data: {
    slotNumber: string;
    status?: string;
    description?: string;
  }) => {
    const response = await apiRequest("/admin/add-slot", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Event API
export const eventAPI = {
  getAll: async () => {
    const response = await apiRequest("/events/all");
    return response.json();
  },

  getAdvanced: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort) queryParams.append("sort", params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/events/advanced-events${queryString ? `?${queryString}` : ""}`;
    const response = await apiRequest(endpoint);
    return response.json();
  },

  create: async (data: {
    eventName: string;
    description?: string;
    date?: string;
  }) => {
    const response = await apiRequest("/events/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: {
    eventName?: string;
    description?: string;
    date?: string;
  }) => {
    const response = await apiRequest(`/events/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await apiRequest(`/events/delete/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (slotId: string, durationMinutes: number) => {
    const response = await apiRequest("/bookings/create", {
      method: "POST",
      body: JSON.stringify({ slotId, durationMinutes }),
    });
    return response.json();
  },
  myList: async () => {
    const response = await apiRequest("/bookings/my");
    return response.json();
  },
};

