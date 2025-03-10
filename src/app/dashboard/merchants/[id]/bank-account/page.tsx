"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";
import { useLoading } from "@/providers/LoadingProvider";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { BankAccountModal } from "@/components/modals/BankAccountModal";
import { BankAccount, Merchant } from "@/types/models";
import { useMerchantAccount } from "@/hooks/useMerchantAccount";
import { useMerchant } from "@/hooks/useMerchant";

interface ApiResponse {
  data: BankAccount[];
}

export default function BankAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bankAccountToDelete, setBankAccountToDelete] =
    useState<BankAccount | null>(null);
  const { setLoading } = useLoading();
  const { id } = React.use(params);
  const { createBankAccount, updateBankAccount, deleteBankAccount } =
    useMerchantAccount(id);

  const { getMerchantById } = useMerchant();

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const merchant = await getMerchantById(id);
      setMerchant(merchant);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [id]);

  const handleSubmit = async (data: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
  }) => {
    try {
      if (selectedBankAccount) {
        await updateBankAccount(data);
      } else {
        await createBankAccount(data);
      }
      setIsModalOpen(false);
      setSelectedBankAccount(null);
      await fetchBankAccounts();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-[80%]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        {!merchant?.bankAccount && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Bank Account
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          {!merchant?.bankAccount ? (
            <div className="text-center py-8 text-muted-foreground">
              No bank account registered yet.
            </div>
          ) : merchant && merchant.bankAccount ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Account Name
                    </h3>
                    <p className="mt-1">{merchant.bankAccount.accountName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Bank Name
                    </h3>
                    <p className="mt-1">{merchant.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </h3>
                    <p className="mt-1">{merchant.bankAccount.accountNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      SWIFT Code
                    </h3>
                    <p className="mt-1">
                      {merchant.bankAccount.swiftCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          merchant.bankAccount.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {merchant.bankAccount.isVerified
                          ? "Verified"
                          : "Pending Verification"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBankAccount(merchant.bankAccount || null);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <BankAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBankAccount(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedBankAccount}
        isLoading={isLoading}
      />
    </div>
  );
}
