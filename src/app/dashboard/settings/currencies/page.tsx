"use client";
import { CurrenciesTable } from "@/components/currencies/currencies-table";
import { SettingsLayout } from "@/components/layouts/settings-layout";
import { useLoading } from "@/providers/LoadingProvider";
import { useEffect } from "react";

export default function DashboardCurrenciesPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Currencies</h3>
          <p className="text-sm text-muted-foreground">
            Manage and configure currencies for your payment system.
          </p>
        </div>
      </div>
      <CurrenciesTable />
    </div>
  );
}
