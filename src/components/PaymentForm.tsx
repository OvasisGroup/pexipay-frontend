"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { endPoints } from "@/lib/endpoints";
import axios from "@/lib/axios";

interface CheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

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
    defaultValues: {
      merchantId: "5b5608a8-e3e4-428e-934f-03198c414e26",
      currency: "USD",
      amount: 0,
      successUrl: "http://github.com/testing-success-url",
      cancelUrl: "http://github.com/testing-cancel-url",
    },
  });

  const createCheckoutSession = async (
    bodyReqBody: z.infer<typeof checkoutSchema>
  ) => {
    setLoading(true);
    try {
      const response = await axios.post<CheckoutResponse>(
        endPoints.checkout.create,
        {
          ...bodyReqBody,
        }
      );

      const { data } = response;

      if (data.checkoutUrl) {
        setSessionId(data.sessionId);
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received from the server");
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
        <CardTitle>Make Your Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(createCheckoutSession)}
          className="space-y-4"
        >
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating session..." : "Create Payment Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
