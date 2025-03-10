"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checkoutSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  successUrl: z.string().url("Must be a valid URL"),
  cancelUrl: z.string().url("Must be a valid URL"),
});

export function PaymentForm() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const createCheckoutSession = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setSessionId(result.sessionId);
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Payment Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(createCheckoutSession)}
          className="space-y-4"
        >
          <div>
            <Input
              {...register("merchantId")}
              placeholder="Merchant ID"
              className="w-full"
            />
            {errors.merchantId && (
              <p className="text-red-500 text-sm">{`${errors.merchantId.message}`}</p>
            )}
          </div>

          <div>
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-full"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{`${errors.amount.message}`}</p>
            )}
          </div>

          <div>
            <Input
              {...register("currency")}
              placeholder="Currency (e.g., USD)"
              className="w-full"
            />
            {errors.currency && (
              <p className="text-red-500 text-sm">{`${errors.currency.message}`}</p>
            )}
          </div>

          <div>
            <Input
              {...register("successUrl")}
              placeholder="Success URL"
              className="w-full"
            />
            {errors.successUrl && (
              <p className="text-red-500 text-sm">{`${errors.successUrl.message}`}</p>
            )}
          </div>

          <div>
            <Input
              {...register("cancelUrl")}
              placeholder="Cancel URL"
              className="w-full"
            />
            {errors.cancelUrl && (
              <p className="text-red-500 text-sm">{`${errors.cancelUrl.message}`}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating session..." : "Create Payment Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
