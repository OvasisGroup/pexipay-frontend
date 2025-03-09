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
    update: (id: string): string => `/merchants/${id}`,
    delete: (id: string): string => `/merchants/${id}`,
  },
  countries: {
    get: "/countries",
    create: "/countries",
    update: (id: string): string => `/countries/${id}`,
    delete: (id: string): string => `/countries/${id}`,
  },
  payments: {
    get: "/payments",
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
