"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaymentsAPIPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Payments API</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-600">
          The Payments API enables you to process payments, handle refunds, and
          manage payment-related operations. It supports multiple payment
          methods and currencies.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">API Endpoints</h2>

        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create Payment</TabsTrigger>
            <TabsTrigger value="retrieve">Retrieve Payment</TabsTrigger>
            <TabsTrigger value="refund">Refund Payment</TabsTrigger>
            <TabsTrigger value="list">List Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <h3 className="text-xl font-medium">Create a Payment</h3>
            <p className="text-gray-600">
              Process a new payment with the specified details.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Process a payment
const createPayment = async (paymentData) => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: paymentData.amount,
      currency: paymentData.currency,
      merchant_id: paymentData.merchantId,
      payment_method: {
        type: 'card',
        card: {
          number: paymentData.card.number,
          exp_month: paymentData.card.expMonth,
          exp_year: paymentData.card.expYear,
          cvc: paymentData.card.cvc,
        },
      },
      description: paymentData.description,
    }),
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="retrieve" className="space-y-4">
            <h3 className="text-xl font-medium">Retrieve Payment Details</h3>
            <p className="text-gray-600">Get details of a specific payment.</p>

            <CodeBlock
              language="typescript"
              code={`
// Get payment details
const getPayment = async (paymentId) => {
  const response = await fetch(\`/api/payments/\${paymentId}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="refund" className="space-y-4">
            <h3 className="text-xl font-medium">Refund Payment</h3>
            <p className="text-gray-600">Process a refund for a payment.</p>

            <CodeBlock
              language="typescript"
              code={`
// Refund a payment
const refundPayment = async (paymentId, refundData) => {
  const response = await fetch(\`/api/payments/\${paymentId}/refund\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: refundData.amount, // Optional, full refund if not specified
      reason: refundData.reason,
    }),
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <h3 className="text-xl font-medium">List Payments</h3>
            <p className="text-gray-600">
              Retrieve a list of payments with optional filters.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// List payments
const listPayments = async (params = {}) => {
  const queryString = new URLSearchParams({
    merchant_id: params.merchantId,
    status: params.status,
    from_date: params.fromDate,
    to_date: params.toDate,
    ...params,
  }).toString();
  
  const response = await fetch(\`/api/payments?\${queryString}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });
  return response.json();
};`}
            />
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Payment Response Format</h2>
        <CodeBlock
          language="json"
          code={`
{
  "id": "pay_123456789",
  "amount": 1000,
  "currency": "USD",
  "status": "succeeded",
  "merchant_id": "merch_123456789",
  "payment_method": {
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025
    }
  },
  "description": "Payment for order #123",
  "created_at": "2024-03-20T12:00:00Z",
  "updated_at": "2024-03-20T12:00:00Z"
}`}
        />
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/api/merchants"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Merchants API
        </a>
        <a
          href="/documentations/api/currencies"
          className="text-primary hover:underline font-medium"
        >
          Next: Currencies API →
        </a>
      </div>
    </div>
  );
}
