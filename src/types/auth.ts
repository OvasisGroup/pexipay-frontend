import { User } from "./models";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  merchant?: {
    businessName: string;
    businessType?: string;
    registrationNo?: string;
    countryId: string;
    supportEmail?: string;
    supportPhone?: string;
    webhookEndpoint?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  countryId: string | null;
  preferredCurrencyId: string | null;
  role: string;
}
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: UserProfileData) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}
