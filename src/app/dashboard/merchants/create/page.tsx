"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountry } from "@/hooks/useCountry";
import { useMerchant } from "@/hooks/useMerchant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Merchant } from "@/types/models";

const merchantSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  businessType: z.string().default("retail"),
  registrationNo: z.string().min(1, "Registration number is required"),
  countryId: z.string().min(1, "Country is required"),
  supportEmail: z.string().email("Invalid email address"),
  supportPhone: z.string().min(1, "Support phone is required"),
  webhookEndpoint: z.string().url("Invalid webhook URL"),
});

export default function CreateMerchant() {
  const { createMerchant } = useMerchant();
  const { countries, fetchCountries } = useCountry({ limit: 100 });

  const form = useForm<z.infer<typeof merchantSchema>>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      businessName: "",
      businessType: "retail",
      registrationNo: "",
      countryId: "",
      supportEmail: "",
      supportPhone: "",
      webhookEndpoint: "",
    },
  });

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  async function onSubmit(values: z.infer<typeof merchantSchema>) {
    try {
      await createMerchant(values as Partial<Merchant>);
      form.reset();
    } catch (error) {
      console.error("Failed to create merchant:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create New Merchant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter business name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">
                        Business Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">
                        Registration Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter registration number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">
                        Support Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="support@example.com"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportPhone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="font-semibold">
                        Support Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter support phone number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webhookEndpoint"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5 sm:col-span-2">
                      <FormLabel className="font-semibold">
                        Webhook Endpoint
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://your-domain.com/webhook"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="submit"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Create Merchant
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
