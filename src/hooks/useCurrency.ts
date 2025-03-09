import { endPoints } from "@/lib/endpoints";
import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  isActive: boolean;
}

interface CurrencyResponse {
  items: Currency[];
  total: number;
}

interface UseCurrencyOptions {
  limit?: number;
}

export function useCurrency({ limit = 10 }: UseCurrencyOptions = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CurrencyResponse | null>(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
        ...(search && { search }),
      });

      const { data } = await axios.get<CurrencyResponse>(
        `${endPoints.currencies.get}?${searchParams.toString()}`
      );

      console.log("Data: ", data);
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, limit]);

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
    setPage(1); // Reset to first page when searching
  }, []);

  const updateCurrency = async (currency: Currency) => {
    try {
      // You can implement your update logic here
      // For example:
      const response = await axios.put(
        `${endPoints.currencies.update(currency.id)}`,
        currency
      );

      if (response.status !== 200) {
        throw new Error("Failed to update currency");
      }
      toast({
        title: "Currency updated successfully",
        description: "The currency has been updated successfully",
        duration: 1000,
      });
      // Refresh the currencies list after update
      await fetchCurrencies();
    } catch (err: any) {
      console.log("Error updating currency", err);
      const message =
        err?.response?.data?.message || "Failed to update currency";
      setError(message);
      toast({
        title: "Currency updated failed",
        variant: "destructive",
        duration: 1000,
        description: message,
      });
      throw new Error(message);
    }
  };

  return {
    currencies: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    search,
    fetchCurrencies,
    nextPage,
    previousPage,
    goToPage,
    updateSearch,
    updateCurrency,
  };
}
