import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { endPoints } from "@/lib/endpoints";
import { useLoading } from "@/providers/LoadingProvider";

interface IpWhitelist {
  id: string;
  ipAddress: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface CreateApiKeyData {
  name: string;
  expiresAt?: string;
}

interface ApiKeyResponse {
  apiKey: ApiKey;
  rawKey?: string;
}

export function useApiKey() {
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<{ apiKeys: ApiKey[] }>(
        endPoints.apiKeys.get
      );
      setApiKeys(data.apiKeys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  const createApiKey = async (
    data: CreateApiKeyData
  ): Promise<ApiKeyResponse> => {
    try {
      setLoading(true);
      const response = await axios.post<{
        message: string;
        apiKey: ApiKey;
        rawKey: string;
      }>(endPoints.apiKeys.create, data);

      toast({
        title: "Success",
        description: "API key created successfully",
      });

      await fetchApiKeys(); // Refresh the list
      return {
        apiKey: response.data.apiKey,
        rawKey: response.data.rawKey,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create API key";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deactivateApiKey = async (id: string) => {
    try {
      setLoading(true);
      await axios.post(endPoints.apiKeys.deactivate(id));
      toast({
        title: "Success",
        description: "API key deactivated successfully",
      });
      await fetchApiKeys(); // Refresh the list
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to deactivate API key";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(endPoints.apiKeys.delete(id));
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
      await fetchApiKeys(); // Refresh the list
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete API key";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // IP Whitelist Management
  const addIpToWhitelist = async (
    apiKeyId: string,
    ipAddress: string,
    description?: string
  ) => {
    try {
      setLoading(true);
      await axios.post(endPoints.apiKeys.ipWhitelist(apiKeyId), {
        ipAddress,
        description,
      });
      toast({
        title: "Success",
        description: "IP address added to whitelist successfully",
        duration: 1000,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add IP to whitelist";
      toast({
        title: "Error",
        description: message,
        duration: 1000,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getWhitelistedIps = async (
    apiKeyId: string
  ): Promise<IpWhitelist[]> => {
    try {
      setLoading(true);
      const { data } = await axios.get<IpWhitelist[]>(
        endPoints.apiKeys.ipWhitelist(apiKeyId)
      );
      return data;
    } catch (err) {
      console.log(err);
      const message =
        err instanceof Error ? err.message : "Failed to fetch whitelisted IPs";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
        duration: 1000,
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeIpFromWhitelist = async (
    apiKeyId: string,
    whitelistId: string
  ) => {
    try {
      setLoading(true);
      await axios.delete(
        endPoints.apiKeys.ipWhitelistDelete(apiKeyId, whitelistId)
      );
      toast({
        title: "Success",
        description: "IP removed from whitelist successfully",
        duration: 1000,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to remove IP from whitelist";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
        duration: 1000,
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    deactivateApiKey,
    deleteApiKey,
    addIpToWhitelist,
    getWhitelistedIps,
    removeIpFromWhitelist,
  };
}
