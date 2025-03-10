import { endPoints } from "@/lib/endpoints";
import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { Merchant } from "@/types/models";
import { useLoading } from "@/providers/LoadingProvider";

interface MerchantResponse {
  items: Merchant[];
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

  return {
    merchants: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    search,
    fetchMerchants,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    nextPage,
    previousPage,
    goToPage,
    updateSearch,
  };
}
