import { Metadata } from "next";
import { CurrenciesTable } from "@/components/currencies/currencies-table";

export const metadata: Metadata = {
  title: "Currencies",
  description: "Manage system currencies",
};

export default function CurrenciesPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Currencies</h2>
        <p className="text-muted-foreground">
          Manage and view all available currencies in the system.
        </p>
      </div>
      <CurrenciesTable />
    </div>
  );
}
