export const endPoints = {
  currencies: {
    get: "/currencies",
    create: "/currencies",
    update: (id: string): string => `/currencies/${id}`,
    delete: (id: string): string => `/currencies/${id}`,
  },
  merchants: {
    get: "/merchants",
    create: "/merchants",
    getById: (id: string): string => `/merchants/${id}`,
    update: (id: string): string => `/merchants/${id}`,
    delete: (id: string): string => `/merchants/${id}`,
  },
  bankAccounts: {
    get: (merchantId: string): string =>
      `/merchants/${merchantId}/bank-account`,
    create: (merchantId: string): string =>
      `/merchants/${merchantId}/bank-account`,
    update: (merchantId: string): string =>
      `/merchants/${merchantId}/bank-account`,
    delete: (merchantId: string): string =>
      `/merchants/${merchantId}/bank-account`,
  },
  transactions: {
    get: (merchantId: string): string =>
      `/merchants/${merchantId}/transactions`,
  },
  settlements: {
    get: (merchantId: string): string => `/merchants/${merchantId}/settlements`,
  },
  notifications: {
    get: (merchantId: string): string =>
      `/merchants/${merchantId}/notifications`,
  },
  documents: {
    get: (merchantId: string): string => `/merchants/${merchantId}/documents`,
  },
  countries: {
    get: "/countries",
    create: "/countries",
    update: (id: string): string => `/countries/${id}`,
    delete: (id: string): string => `/countries/${id}`,
  },

  checkout: {
    create: `/payments/checkout/session`,
    initatePayment: (sessiondId: string) => `/payments/checkout/${sessiondId}`,
  },
  payments: {
    merchantPayments: (merchantId: string) =>
      `/merchants/${merchantId}/payments`,
    get: "/payments/",
    create: "/payments",
    update: (id: string): string => `/payments/${id}`,
    delete: (id: string): string => `/payments/${id}`,
  },
  apiKeys: {
    get: "/keys",
    create: "/keys",
    delete: (id: string): string => `/keys/${id}`,
    deactivate: (id: string): string => `/keys/${id}/deactivate`,
    ipWhitelist: (id: string): string => `/keys/${id}/whitelist`,
    ipWhitelistCreate: (id: string): string => `/keys/${id}/whitelist`,
    ipWhitelistDelete: (id: string, whitelistId: string): string =>
      `/keys/${id}/whitelist/${whitelistId}`,
  },
} as const;
