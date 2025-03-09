export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MERCHANT = "merchant",
  DEVELOPER = "developer",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  MOBILE_MONEY = "mobile_money",
  CRYPTO = "crypto",
}

export enum PaymentStatus {
  INITIATED = "initiated",
  PROCESSING = "processing",
  SUCCESSFUL = "successful",
  FAILED = "failed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  countryId?: string;
  preferredCurrencyId?: string;
  country?: Country;
  preferredCurrency?: Currency;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
}

export interface Merchant {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  user?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProcessor {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  supportedPaymentMethods: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  merchantId: string;
  merchant?: Merchant;
  userId: string;
  user?: User;
  processorId: string;
  processor?: PaymentProcessor;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
