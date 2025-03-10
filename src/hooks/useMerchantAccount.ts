import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/providers/LoadingProvider";
import { BankAccount } from "@/types/models";

interface CreateBankAccountData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
}

interface UpdateBankAccountData extends CreateBankAccountData {}

export function useMerchantAccount(merchantId: string) {
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const createBankAccount = useCallback(
    async (data: CreateBankAccountData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post<{ data: BankAccount }>(
          endPoints.bankAccounts.create(merchantId),
          data
        );
        toast({
          title: "Success",
          description: "Bank account created successfully",
        });
        return response.data.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to create bank account";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [merchantId]
  );

  const updateBankAccount = useCallback(
    async (data: UpdateBankAccountData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.patch<{ data: BankAccount }>(
          endPoints.bankAccounts.update(merchantId),
          data
        );
        toast({
          title: "Success",
          description: "Bank account updated successfully",
        });
        return response.data.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to update bank account";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [merchantId]
  );

  const deleteBankAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(endPoints.bankAccounts.delete(merchantId));
      toast({
        title: "Success",
        description: "Bank account deleted successfully",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to delete bank account";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  return {
    error,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
  };
}
