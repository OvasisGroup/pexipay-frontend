import { CurrenciesTable } from "@/components/currencies/currencies-table";
import { SettingsLayout } from "@/components/layouts/settings-layout";

export default function DashboardCurrenciesPage() {
  return (
    <SettingsLayout>
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
    </SettingsLayout>
  );
}
