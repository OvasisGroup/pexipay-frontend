"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLoading } from "@/providers/LoadingProvider";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  isDefault: boolean;
  status: string;
}

interface ApiResponse {
  data: BankAccount[];
}

export default function BankAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${endPoints.merchants.get}/${params.id}/bank-accounts`
        );
        setBankAccounts(response.data.data);
      } catch (error: any) {
        toast({
          title: "Error fetching bank accounts",
          description:
            error?.response?.data?.message || "Could not fetch bank accounts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [params.id]);

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
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bank accounts registered yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Bank Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.accountName}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>{account.bankCode}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          account.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {account.isDefault ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
