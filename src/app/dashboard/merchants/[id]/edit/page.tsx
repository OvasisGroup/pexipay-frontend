"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { Merchant } from "@/types/models";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useLoading } from "@/providers/LoadingProvider";
import React from "react";
import { ArrowLeft } from "lucide-react";
const merchantFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().optional(),
  registrationNo: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  webhookEndpoint: z.string().url().optional().or(z.literal("")),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;

export default function EditMerchantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { isLoading, setLoading } = useLoading();

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      registrationNo: "",
      supportEmail: "",
      supportPhone: "",
      webhookEndpoint: "",
    },
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Merchant>(
          `${endPoints.merchants.get}/${id}`
        );

        // Set form values from merchant data
        form.reset({
          businessName: data.businessName,
          businessType: data.businessType || "",
          registrationNo: data.registrationNo || "",
          supportEmail: data.supportEmail || "",
          supportPhone: data.supportPhone || "",
          webhookEndpoint: data.webhookEndpoint || "",
        });
      } catch (error: any) {
        toast({
          title: "Error fetching merchant",
          description:
            error?.response?.data?.message ||
            "Could not fetch merchant details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMerchant();
    }
  }, [id, form]);

  async function onSubmit(values: MerchantFormValues) {
    try {
      await axios.put(`${endPoints.merchants.update}/${id}`, values);
      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });
      router.push(`/dashboard/merchants/${id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error updating merchant",
        description:
          error?.response?.data?.message || "Could not update merchant details",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Merchant</h1>
        <Link href={`/dashboard/merchants`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
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

              <div className="flex justify-end space-x-4">
                <Link href={`/dashboard/merchants/${id}`}>
                  <Button variant="outline" type="button">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
