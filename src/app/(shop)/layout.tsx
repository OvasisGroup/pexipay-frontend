import { Navbar } from "@/components/Navbar";
import { PaymentForm } from "@/components/PaymentForm";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
