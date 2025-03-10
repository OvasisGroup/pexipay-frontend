"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/providers/LoadingProvider";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Merchant } from "@/types/models";

const merchantSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().optional(),
  registrationNo: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  webhookEndpoint: z.string().url().optional().or(z.literal("")),
});

type MerchantSettingsValues = z.infer<typeof merchantSettingsSchema>;

export default function SettingsPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();

  const form = useForm<MerchantSettingsValues>({
    resolver: zodResolver(merchantSettingsSchema),
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Merchant>(
          `${endPoints.merchants.get}/${params.id}`
        );
        form.reset({
          businessName: data.businessName,
          businessType: data.businessType,
          registrationNo: data.registrationNo,
          supportEmail: data.supportEmail,
          supportPhone: data.supportPhone,
          webhookEndpoint: data.webhookEndpoint,
        });
      } catch (error: any) {
        toast({
          title: "Error fetching merchant details",
          description:
            error?.response?.data?.message ||
            "Could not fetch merchant details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [params.id]);

  const onSubmit = async (values: MerchantSettingsValues) => {
    try {
      setLoading(true);
      await axios.put(`${endPoints.merchants.get}/${params.id}`, values);
      toast({
        title: "Success",
        description: "Merchant details updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating merchant details",
        description:
          error?.response?.data?.message || "Could not update merchant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merchant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhookEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook Endpoint</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
