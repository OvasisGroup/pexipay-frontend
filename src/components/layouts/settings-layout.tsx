"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNavItems = [
  {
    title: "Countries",
    href: "/dashboard/settings/countries",
  },
  {
    title: "Currencies",
    href: "/dashboard/settings/currencies",
  },
  {
    title: "API Keys",
    href: "/dashboard/settings/api-keys",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-8 p-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <div className="flex overflow-x-auto">
          <nav className="flex space-x-2 border-b w-full" aria-label="Tabs">
            {settingsNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "relative h-9 rounded-none border-b-2 border-transparent px-4",
                    pathname === item.href &&
                      "border-primary font-medium text-primary"
                  )}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
