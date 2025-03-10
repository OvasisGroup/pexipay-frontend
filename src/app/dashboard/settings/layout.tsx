"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ArrowLeft,
  DollarSign,
  KeyIcon,
  MapPinIcon,
} from "lucide-react";
import { useLoading } from "@/providers/LoadingProvider";

export default function MerchantDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useLoading();

  const menuItems = [
    // {
    //   icon: LayoutDashboard,
    //   label: "Overview",
    //   href: `/dashboard/settings`,
    // },
    {
      icon: MapPinIcon,
      label: "Countries",
      href: `/dashboard/settings/countries`,
    },
    {
      icon: DollarSign,
      label: "Currencies",
      href: `/dashboard/settings/currencies`,
    },
    {
      icon: KeyIcon,
      label: "Api Keys",
      href: `/dashboard/settings/api-keys`,
    },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-50 bg-white border-r">
        <div className="p-4">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
