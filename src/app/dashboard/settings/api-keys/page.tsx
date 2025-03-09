import { ApiKeysTable } from "@/components/api-keys/api-keys-table";
import { SettingsLayout } from "@/components/layouts/settings-layout";

export default function DashboardApiKeysPage() {
  return (
    <SettingsLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">API Keys</h3>
            <p className="text-sm text-muted-foreground">
              Manage your API keys and IP whitelists for secure API access.
            </p>
          </div>
        </div>
        <ApiKeysTable />
      </div>
    </SettingsLayout>
  );
}
