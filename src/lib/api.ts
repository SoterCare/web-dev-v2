export const API_BASE_URL = "/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // On 401 throw so callers handle it gracefully.
  // Page-level auth is enforced server-side; hard navigation here would
  // destroy in-flight React state (removedRef, etc.) and cause visual "refreshes".
  if (res.status === 401) {
    throw new Error("unauthorized");
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
