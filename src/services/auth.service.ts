import { RegisterCredentials, ResetPasswordRequest } from "@/types/auth";
import { User, UserRole } from "@/types/models";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private static TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";
  private static USER_KEY = "user";

  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(AuthService.TOKEN_KEY);
      this.refreshToken = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem(AuthService.TOKEN_KEY, token);
      localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, refreshToken);

      const decoded = jwtDecode<TokenPayload>(token);
      localStorage.setItem(
        AuthService.USER_KEY,
        JSON.stringify({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        })
      );
    }
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_KEY);
    }
  }

  public getToken(): string | null {
    const token = useAuthStore.getState().token;
    return token;
  }

  public getRefreshToken(): string | null {
    const refreshToken = useAuthStore.getState().refreshToken;
    return refreshToken;
  }

  public getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(AuthService.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        { email, password }
      );

      const { access_token, refresh_token, user } = response.data;
      this.setTokens(access_token, refresh_token);
      return user;
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  public async register(
    credentials: RegisterCredentials
  ): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/register`,
        credentials
      );
      const { access_token, refresh_token } = response.data;
      this.setTokens(access_token, refresh_token);
      return response.data;
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  public async refreshAccessToken(): Promise<string> {
    const response = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });

    const { access_token, refresh_token } = await response.json();

    console.table({ access_token, refresh_token });
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const response = await fetch(`/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const { access_token, refresh_token } = await response.json();

      console.log("Refreshed token", access_token);
      this.token = access_token;
      if (typeof window !== "undefined") {
        localStorage.setItem(AuthService.TOKEN_KEY, access_token);
        localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, refresh_token);
      }
      this.setTokens(access_token, refresh_token);
      return access_token;
    } catch (error) {
      console.log("Token refresh failed", error);
      this.logout();
      throw new Error("Token refresh failed");
    }
  }

  public async fetchUserProfile(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/password/reset/request`, { email });
    } catch (error) {
      throw new Error("Password reset request failed");
    }
  }

  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/password/reset`, data);
    } catch (error) {
      throw new Error("Password reset failed");
    }
  }

  public logout(): void {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
}

export default AuthService.getInstance();
