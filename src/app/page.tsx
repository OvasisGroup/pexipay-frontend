import { Navbar } from "@/components/Navbar";
import { PaymentForm } from "@/components/PaymentForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Payment Processing System
        </h1>
        <PaymentForm />
      </main>
    </div>
  );
}
