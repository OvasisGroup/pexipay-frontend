export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MERCHANT = "merchant",
  DEVELOPER = "developer",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_MONEY = "MOBILE_MONEY",
  CRYPTO = "CRYPTO",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
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
  lastLoginAt: Date | null;
  refreshToken?: string;
  countryId?: string;
  preferredCurrencyId?: string;
  country?: Country;
  preferredCurrency?: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MerchantStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export interface Merchant {
  id: string;
  ownerId: string;
  businessName: string;
  businessType?: string;
  registrationNo?: string;
  status: MerchantStatus;
  countryId: string;
  supportEmail?: string;
  supportPhone?: string;
  commissionRate: number;
  webhookEndpoint?: string;
  webhookSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  bankAccount?: BankAccount;
  country?: Country;
  owner?: User;
  address?: Address;
}

export interface Address {
  id: string;
  merchantId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  id: string;
  merchantId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  countryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  country?: Country;
}

export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  amount: number;
  currencyId: string;
  description?: string;
  status: TransactionStatus;
  referenceId: string;
  paymentMethod: PaymentMethod;
  metadata?: any;
  errorMessage?: string;
  refundId?: string;
  createdAt: Date;
  updatedAt: Date;
  currency?: Currency;
  merchant?: Merchant;
  user?: User;
}

export enum SettlementStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Settlement {
  id: string;
  merchantId: string;
  amount: number;
  currencyId: string;
  status: SettlementStatus;
  description?: string;
  reference: string;
  initiatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
  currency?: Currency;
  merchant?: Merchant;
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  SETTLEMENT = "SETTLEMENT",
  ACCOUNT = "ACCOUNT",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
}

export interface Notification {
  id: string;
  userId?: string;
  merchantId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  user?: User;
  merchant?: Merchant;
}

export interface Document {
  id: string;
  userId?: string;
  user?: User;
  merchantId?: string;
  merchant?: Merchant;
  type: DocumentType;
  url: string;
  filename: string;
  mimeType: string;
  verified: boolean;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  uploadedAt: Date;
  expiresAt: Date | null;
}

export interface PaymentSession {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  successUrl: string;
  cancelUrl: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Payment {
  id: string;
  merchantId: string;
  sessionId: string;
  amount: number;
  currencyId: string;
  status: PaymentStatus;
  lastFourDigits: string;
  cardholderName: string;
  createdAt: Date;
  updatedAt: Date;
  currency?: string;
  merchant?: Merchant;
  session?: PaymentSession;
}
