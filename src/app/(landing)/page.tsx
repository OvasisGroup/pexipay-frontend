import { Navbar } from "@/components/Navbar";
import { PaymentForm } from "@/components/PaymentForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">
        Process Your Payment
      </h1>
      <PaymentForm />
    </div>
  );
}
