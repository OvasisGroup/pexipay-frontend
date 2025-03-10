"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Receipt,
  Wallet,
  FileText,
  Settings,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { useLoading } from "@/providers/LoadingProvider";
import axios from "@/lib/axios";
import { endPoints } from "@/lib/endpoints";
import { Merchant } from "@/types/models";
import React from "react";
import { toast } from "@/components/ui/use-toast";

export default function MerchantDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useLoading();
  const [merchant, setMerchant] = useState<Merchant | null>(null);

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
            error?.response?.data?.message || "Could not fetch merchant",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [id]);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: `/dashboard/merchants/${id}`,
    },
    {
      icon: Building2,
      label: "Bank Account",
      href: `/dashboard/merchants/${id}/bank-account`,
    },
    {
      icon: CreditCard,
      label: "Transactions",
      href: `/dashboard/merchants/${id}/transactions`,
    },
    {
      icon: Receipt,
      label: "Payments",
      href: `/dashboard/merchants/${id}/payments`,
    },
    {
      icon: Wallet,
      label: "Settlements",
      href: `/dashboard/merchants/${id}/settlements`,
    },
    {
      icon: Bell,
      label: "Notifications",
      href: `/dashboard/merchants/${id}/notifications`,
    },
    {
      icon: FileText,
      label: "Documents",
      href: `/dashboard/merchants/${id}/documents`,
    },
    {
      icon: Settings,
      label: "Settings",
      href: `/dashboard/merchants/${id}/settings`,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/dashboard/merchants")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Merchants
          </Button>
        </div>
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
