"use client";

import { useEffect } from "react";
import { CountriesTable } from "@/components/countries/countries-table";
import { SettingsLayout } from "@/components/layouts/settings-layout";
import { useLoading } from "@/providers/LoadingProvider";

export default function DashboardCountriesPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    // Turn off loading when component mounts (content is ready)
    setLoading(false);
  }, [setLoading]);

  return (
    <SettingsLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Countries</h3>
            <p className="text-sm text-muted-foreground">
              Manage and configure countries for your payment system.
            </p>
          </div>
        </div>
        <CountriesTable />
      </div>
    </SettingsLayout>
  );
}
