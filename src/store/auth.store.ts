import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  UserProfileData,
} from "@/types/auth";
import { User } from "@/types/models";

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

// Create a type-safe storage object
const storage: StateStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    }
  },
};

// Type for persisted state
type PersistedState = Pick<
  AuthState,
  "user" | "token" | "refreshToken" | "isAuthenticated"
>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          set({
            user: data.user,
            token: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error("Registration failed");
          }

          await get().login({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${get().token}`,
            },
          });
        } catch (error) {
          console.error("Logout API call failed:", error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (profileData: UserProfileData) => {
        try {
          const response = await axios.post("/auth/update-profile", {
            ...profileData,
          });

          set({
            user: (response.data as { user: User }).user,
          });
        } catch (error) {
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;

        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: currentRefreshToken }),
          });

          if (!response.ok) {
            throw new Error("Token refresh failed");
          }

          const data = await response.json();
          set({
            token: data.access_token,
            refreshToken: data.refresh_token,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (token && isTokenExpired(token)) {
          await get().refreshAccessToken();
        }
      },

      resetPassword: async (data: ResetPasswordRequest) => {
        try {
          const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Password reset failed");
          }
        } catch (error) {
          throw error;
        }
      },

      requestPasswordReset: async (email: string) => {
        try {
          const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            throw new Error("Password reset request failed");
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: (state): PersistedState => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
