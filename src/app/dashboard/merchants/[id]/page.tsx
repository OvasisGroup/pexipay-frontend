"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { Merchant } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/providers/LoadingProvider";
import React from "react";

export default function MerchantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const { isLoading, setLoading } = useLoading();

  const { id } = React.use(params);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Merchant>(
          `${endPoints.merchants.get}/${id}`
        );
        setMerchant(data);
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
  }, [id]);

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

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Merchant not found</h2>
        <Link href="/dashboard/merchants">
          <Button>Back to Merchants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{merchant.businessName}</h1>
        <div className="space-x-2">
          <Link href={`/dashboard/merchants/${merchant.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Business Type
              </p>
              <p className="text-lg">{merchant.businessType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Registration Number
              </p>
              <p className="text-lg">{merchant.registrationNo || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Support Email
              </p>
              <p className="text-lg">{merchant.supportEmail || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Support Phone
              </p>
              <p className="text-lg">{merchant.supportPhone || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Webhook Endpoint
              </p>
              <p className="text-lg break-all">
                {merchant.webhookEndpoint || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
