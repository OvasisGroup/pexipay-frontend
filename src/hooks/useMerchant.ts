import { endPoints } from "@/lib/endpoints";
import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import {
  Merchant,
  Transaction,
  Settlement,
  Notification,
  Document,
} from "@/types/models";
import { useLoading } from "@/providers/LoadingProvider";

interface MerchantResponse {
  items: Merchant[];
  total: number;
}

interface ApiListResponse<T> {
  data: T[];
  total: number;
}

interface UseMerchantOptions {
  limit?: number;
}

export function useMerchant({ limit = 10 }: UseMerchantOptions = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MerchantResponse | null>(null);

  // Add new state for merchant-related data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
        ...(search && { search }),
      });

      const { data } = await axios.get<MerchantResponse>(
        `${endPoints.merchants.get}?${searchParams.toString()}`
      );

      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, search, limit]);

  const getMerchantById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get<Merchant>(
        endPoints.merchants.getById(id)
      );

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMerchant = async (merchantData: Partial<Merchant>) => {
    try {
      const response = await axios.post(
        endPoints.merchants.create,
        merchantData
      );
      toast({
        title: "Merchant created successfully",
        description: "The merchant has been created successfully",
        duration: 2000,
      });
      await fetchMerchants();
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to create merchant";
      toast({
        title: "Error creating merchant",
        description: message,
        variant: "destructive",
        duration: 2000,
      });
      throw new Error(message);
    }
  };

  const updateMerchant = async (
    id: string,
    merchantData: Partial<Merchant>
  ) => {
    try {
      const response = await axios.put(
        `${endPoints.merchants.update(id)}`,
        merchantData
      );
      toast({
        title: "Merchant updated successfully",
        description: "The merchant has been updated successfully",
        duration: 2000,
      });
      await fetchMerchants();
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update merchant";
      toast({
        title: "Error updating merchant",
        description: message,
        variant: "destructive",
        duration: 2000,
      });
      throw new Error(message);
    }
  };

  const deleteMerchant = async (id: string) => {
    try {
      await axios.delete(`${endPoints.merchants.delete(id)}`);
      toast({
        title: "Merchant deleted successfully",
        description: "The merchant has been deleted successfully",
        duration: 2000,
      });
      await fetchMerchants();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to delete merchant";
      toast({
        title: "Error deleting merchant",
        description: message,
        variant: "destructive",
        duration: 2000,
      });
      throw new Error(message);
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  }, [page, totalPages]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }, [page]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setPage(pageNumber);
      }
    },
    [totalPages]
  );

  const updateSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  }, []);

  // New functions for fetching merchant-related data
  const fetchMerchantTransactions = async (
    merchantId: string
  ): Promise<Transaction[]> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiListResponse<Transaction>>(
        endPoints.transactions.get(merchantId)
      );
      setTransactions(response.data.data);
      return response.data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch transactions";
      toast({
        title: "Error fetching transactions",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantSettlements = async (
    merchantId: string
  ): Promise<Settlement[]> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiListResponse<Settlement>>(
        endPoints.settlements.get(merchantId)
      );
      setSettlements(response.data.data);
      return response.data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch settlements";
      toast({
        title: "Error fetching settlements",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantNotifications = async (
    merchantId: string
  ): Promise<Notification[]> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiListResponse<Notification>>(
        endPoints.notifications.get(merchantId)
      );
      setNotifications(response.data.data);
      return response.data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch notifications";
      toast({
        title: "Error fetching notifications",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantDocuments = async (
    merchantId: string
  ): Promise<Document[]> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiListResponse<Document>>(
        endPoints.documents.get(merchantId)
      );
      setDocuments(response.data.data);
      return response.data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch documents";
      toast({
        title: "Error fetching documents",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    merchants: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    getMerchantById,
    search,
    fetchMerchants,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    nextPage,
    previousPage,
    goToPage,
    updateSearch,
    transactions,
    settlements,
    notifications,
    documents,
    fetchMerchantTransactions,
    fetchMerchantSettlements,
    fetchMerchantNotifications,
    fetchMerchantDocuments,
  };
}
