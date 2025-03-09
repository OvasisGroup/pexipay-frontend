import { endPoints } from "@/lib/endpoints";
import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

interface Country {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface CountryResponse {
  items: Country[];
  total: number;
}

interface UseCountryOptions {
  limit?: number;
}

export function useCountry({ limit = 10 }: UseCountryOptions = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CountryResponse | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
        ...(search && { search }),
      });

      const { data } = await axios.get<CountryResponse>(
        `${endPoints.countries.get}?${searchParams.toString()}`
      );

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

  const updateCountry = async (country: Country) => {
    try {
      const response = await axios.put(
        `${endPoints.countries.update(country.id)}`,
        country
      );

      if (response.status !== 200) {
        throw new Error("Failed to update country");
      }
      toast({
        title: "Country updated successfully",
        description: "The country has been updated successfully",
        duration: 1000,
      });
      // Refresh the countries list after update
      await fetchCountries();
    } catch (err: any) {
      console.log("Error updating country", err);
      const message =
        err?.response?.data?.message || "Failed to update country";
      setError(message);
      toast({
        title: "Country update failed",
        variant: "destructive",
        duration: 1000,
        description: message,
      });
      throw new Error(message);
    }
  };

  return {
    countries: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    search,
    fetchCountries,
    nextPage,
    previousPage,
    goToPage,
    updateSearch,
    updateCountry,
  };
}
