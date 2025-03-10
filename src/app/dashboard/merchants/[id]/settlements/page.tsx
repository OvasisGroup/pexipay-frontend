"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import React from "react";
import { useMerchant } from "@/hooks/useMerchant";

interface Settlement {
  id: string;
  amount: number;
  currency: string;
  status: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  createdAt: string;
  reference: string;
  period: {
    start: string;
    end: string;
  };
}

interface ApiResponse {
  data: Settlement[];
}

export default function SettlementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading, fetchMerchantSettlements, settlements } = useMerchant();
  const { setLoading } = useLoading();

  const { id } = React.use(params);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        await fetchMerchantSettlements(id);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [id]);

  const filteredSettlements = settlements?.filter((settlement) =>
    settlement.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Settlements</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredSettlements?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No settlements found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettlements?.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell>{settlement.reference}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: settlement.currency?.code,
                      }).format(settlement.amount)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {settlement.merchant?.bankAccount?.accountName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {settlement.merchant?.bankAccount?.bankName} -{" "}
                          {settlement.merchant?.bankAccount?.accountNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {new Date(
                            settlement.initiatedAt
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          to{" "}
                          {new Date(settlement.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          settlement.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : settlement.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {settlement.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(settlement.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
