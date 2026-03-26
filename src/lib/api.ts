export const API_BASE_URL = "/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Auto-redirect to login on auth failure
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/dashboard/login";
  }

  return res;
};

// --- Auth Services ---

export interface RegisterPayload {
  name: string;
  email: string;
}

export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
}

export const authService = {
  register: (payload: RegisterPayload) => 
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    
  verifyRegistration: (payload: VerifyPayload) => 
    apiFetch("/auth/verify", { method: "POST", body: JSON.stringify(payload) }),

  login: (payload: LoginPayload) => 
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  verifyLogin: (payload: VerifyPayload) => 
    apiFetch("/auth/login-verify", { method: "POST", body: JSON.stringify(payload) })
};
