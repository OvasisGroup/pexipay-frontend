"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CurrenciesAPIPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Currencies API</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-600">
          The Currencies API allows you to manage supported currencies for your
          merchants and retrieve exchange rates. Each merchant can be configured
          to accept payments in specific currencies.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">API Endpoints</h2>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List Currencies</TabsTrigger>
            <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
            <TabsTrigger value="merchant">Merchant Currencies</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <h3 className="text-xl font-medium">List Supported Currencies</h3>
            <p className="text-gray-600">
              Get a list of all supported currencies.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Get all supported currencies
const getSupportedCurrencies = async () => {
  const response = await fetch('/api/currencies', {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });
  return response.json();
};`}
            />

            <h4 className="text-lg font-medium mt-6">Response Format</h4>
            <CodeBlock
              language="json"
              code={`
{
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "decimal_places": 2
    },
    {
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "decimal_places": 2
    }
  ]
}`}
            />
          </TabsContent>

          <TabsContent value="rates" className="space-y-4">
            <h3 className="text-xl font-medium">Get Exchange Rates</h3>
            <p className="text-gray-600">
              Retrieve current exchange rates for currencies.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Get exchange rates
const getExchangeRates = async (baseCurrency = 'USD') => {
  const response = await fetch(\`/api/currencies/rates?base=\${baseCurrency}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });
  return response.json();
};`}
            />

            <h4 className="text-lg font-medium mt-6">Response Format</h4>
            <CodeBlock
              language="json"
              code={`
{
  "base": "USD",
  "date": "2024-03-20",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 110.25
  }
}`}
            />
          </TabsContent>

          <TabsContent value="merchant" className="space-y-4">
            <h3 className="text-xl font-medium">Manage Merchant Currencies</h3>
            <p className="text-gray-600">
              Configure which currencies a merchant can accept.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Update merchant currencies
const updateMerchantCurrencies = async (merchantId, currencies) => {
  const response = await fetch(\`/api/merchants/\${merchantId}/currencies\`, {
    method: 'PUT',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currencies }),
  });
  return response.json();
};

// Get merchant currencies
const getMerchantCurrencies = async (merchantId) => {
  const response = await fetch(\`/api/merchants/\${merchantId}/currencies\`, {
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
        <h2 className="text-2xl font-semibold">Currency Formatting</h2>
        <p className="text-gray-600">
          Use our helper functions to properly format currency amounts:
        </p>
        <CodeBlock
          language="typescript"
          code={`
// Format amount in specific currency
const formatCurrencyAmount = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Amounts are stored in cents
};

// Examples:
formatCurrencyAmount(1000, 'USD'); // "$10.00"
formatCurrencyAmount(1000, 'EUR'); // "€10.00"
formatCurrencyAmount(1000, 'JPY'); // "¥1,000"`}
        />
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/api/payments"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Payments API
        </a>
        <a
          href="/documentations/guides/quick-start"
          className="text-primary hover:underline font-medium"
        >
          Next: Quick Start Guide →
        </a>
      </div>
    </div>
  );
}
