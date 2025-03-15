"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Search, Download, PlusCircle } from "lucide-react";
import React from "react";
import { useMerchant } from "@/hooks/useMerchant";
import { PaymentStatus, Payment } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface PaymentDetailsModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchMerchantPayments, payments, isLoading } = useMerchant();
  const { id } = React.use(params);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      await fetchMerchantPayments(id);
    };
    fetchPayments();
  }, [id]);

  const filteredPayments = payments?.items?.filter((payment) =>
    payment.cardholderName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="space-x-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
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

          {filteredPayments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments?.map((payment, index: number) => (
                  <TableRow key={payment.id}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>
                      {payment.sessionId?.slice(0, 15).toLocaleUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {payment.cardholderName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: payment.currency,
                      }).format(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === PaymentStatus.COMPLETED
                            ? "bg-green-100 text-green-800"
                            : payment.status === PaymentStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}

function PaymentDetailsModal({
  payment,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Session Reference</div>
            <div>{payment.sessionId.toLocaleUpperCase()}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Cardholder Name</div>
            <div>{payment.cardholderName}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Amount</div>
            <div>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: payment.currency,
              }).format(payment.amount)}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Card Number</div>
            <div>**** **** **** {payment.lastFourDigits}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Status</div>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === PaymentStatus.COMPLETED
                    ? "bg-green-100 text-green-800"
                    : payment.status === PaymentStatus.PENDING
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Created At</div>
            <div>{format(new Date(payment.createdAt), "PPpp")}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Updated At</div>
            <div>{format(new Date(payment.updatedAt), "PPpp")}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
