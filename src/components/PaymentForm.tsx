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
import { CurrencySelect } from "@/components/CurrencySelect";
import { CountrySelect } from "@/components/CountrySelect";

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
  customer: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
    billing_address: z.object({
      first_name: z.string().min(1, "First name is required"),
      last_name: z.string().min(1, "Last name is required"),
      address_line1: z.string().min(1, "Address is required"),
      address_city: z.string().min(1, "City is required"),
      address_state: z.string().min(1, "State is required"),
      address_country: z
        .string()
        .length(2, "Country code must be 2 characters"),
      address_postcode: z.string().min(1, "Postal code is required"),
    }),
  }),
});

export function PaymentForm() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      merchantId: "5b5608a8-e3e4-428e-934f-03198c414e26",
      currency: "KES",
      amount: 100.0,
      successUrl: `http://github.com/testing-payment/success`,
      cancelUrl: `http://github.com/testing-payment/cancel`,
      customer: {
        email: "",
        phone: "",
        billing_address: {
          first_name: "",
          last_name: "",
          address_line1: "",
          address_city: "",
          address_state: "",
          address_country: "KE",
          address_postcode: "",
        },
      },
    },
  });

  const createCheckoutSession = async (
    bodyReqBody: z.infer<typeof checkoutSchema>
  ) => {
    setLoading(true);
    try {
      console.log("Req Body: ", bodyReqBody);
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
            <CurrencySelect
              value={watch("currency")}
              onChange={(value) => setValue("currency", value)}
              placeholder="Select currency..."
            />
            {errors.currency && (
              <p className="text-red-500 text-sm">{`${errors.currency.message}`}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Customer Information</h3>

            <div>
              <Input
                {...register("customer.email")}
                type="email"
                placeholder="Email"
                className="w-full"
              />
              {errors.customer?.email && (
                <p className="text-red-500 text-sm">{`${errors.customer.email.message}`}</p>
              )}
            </div>

            <div>
              <Input
                {...register("customer.phone")}
                placeholder="Phone Number"
                className="w-full"
              />
              {errors.customer?.phone && (
                <p className="text-red-500 text-sm">{`${errors.customer.phone.message}`}</p>
              )}
            </div>

            <h3 className="font-medium">Billing Address</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  {...register("customer.billing_address.first_name")}
                  placeholder="First Name"
                  className="w-full"
                />
                {errors.customer?.billing_address?.first_name && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.first_name.message}`}</p>
                )}
              </div>

              <div>
                <Input
                  {...register("customer.billing_address.last_name")}
                  placeholder="Last Name"
                  className="w-full"
                />
                {errors.customer?.billing_address?.last_name && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.last_name.message}`}</p>
                )}
              </div>
            </div>

            <div>
              <Input
                {...register("customer.billing_address.address_line1")}
                placeholder="Address"
                className="w-full"
              />
              {errors.customer?.billing_address?.address_line1 && (
                <p className="text-red-500 text-sm">{`${errors.customer.billing_address.address_line1.message}`}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  {...register("customer.billing_address.address_city")}
                  placeholder="City"
                  className="w-full"
                />
                {errors.customer?.billing_address?.address_city && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.address_city.message}`}</p>
                )}
              </div>

              <div>
                <Input
                  {...register("customer.billing_address.address_state")}
                  placeholder="State"
                  className="w-full"
                />
                {errors.customer?.billing_address?.address_state && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.address_state.message}`}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <CountrySelect
                  value={watch("customer.billing_address.address_country")}
                  onChange={(value) =>
                    setValue("customer.billing_address.address_country", value)
                  }
                  placeholder="Select country..."
                />
                {errors.customer?.billing_address?.address_country && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.address_country.message}`}</p>
                )}
              </div>

              <div>
                <Input
                  {...register("customer.billing_address.address_postcode")}
                  placeholder="Postal Code"
                  className="w-full"
                />
                {errors.customer?.billing_address?.address_postcode && (
                  <p className="text-red-500 text-sm">{`${errors.customer.billing_address.address_postcode.message}`}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating session..." : "Create Payment Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
