"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MerchantsAPIPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Merchants API</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-600">
          The Merchants API allows you to create and manage merchant accounts in
          our payment gateway. Each merchant can have their own configuration
          for supported currencies and payment methods.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">API Endpoints</h2>

        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create Merchant</TabsTrigger>
            <TabsTrigger value="get">Get Merchant</TabsTrigger>
            <TabsTrigger value="update">Update Merchant</TabsTrigger>
            <TabsTrigger value="list">List Merchants</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <h3 className="text-xl font-medium">Create a Merchant</h3>
            <p className="text-gray-600">
              Create a new merchant account with the specified details.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Create a new merchant
const createMerchant = async (merchantData) => {
  const response = await fetch('/api/merchants', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: merchantData.name,
      email: merchantData.email,
      business_type: merchantData.businessType,
      country: merchantData.country,
      currencies: merchantData.currencies,
    }),
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="get" className="space-y-4">
            <h3 className="text-xl font-medium">Get Merchant Details</h3>
            <p className="text-gray-600">
              Retrieve details of a specific merchant.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Get merchant details
const getMerchant = async (merchantId) => {
  const response = await fetch(\`/api/merchants/\${merchantId}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
    },
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="update" className="space-y-4">
            <h3 className="text-xl font-medium">Update Merchant</h3>
            <p className="text-gray-600">
              Update an existing merchant's details.
            </p>

            <CodeBlock
              language="typescript"
              code={`
// Update merchant details
const updateMerchant = async (merchantId, updateData) => {
  const response = await fetch(\`/api/merchants/\${merchantId}\`, {
    method: 'PUT',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  return response.json();
};`}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <h3 className="text-xl font-medium">List Merchants</h3>
            <p className="text-gray-600">Retrieve a list of all merchants.</p>

            <CodeBlock
              language="typescript"
              code={`
// List all merchants
const listMerchants = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(\`/api/merchants?\${queryString}\`, {
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
        <h2 className="text-2xl font-semibold">Response Format</h2>
        <CodeBlock
          language="json"
          code={`
{
  "id": "merch_123456789",
  "name": "Example Merchant",
  "email": "merchant@example.com",
  "business_type": "individual",
  "country": "US",
  "currencies": ["USD", "EUR"],
  "created_at": "2024-03-20T12:00:00Z",
  "updated_at": "2024-03-20T12:00:00Z"
}`}
        />
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/authentication"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Authentication
        </a>
        <a
          href="/documentations/api/payments"
          className="text-primary hover:underline font-medium"
        >
          Next: Payments API →
        </a>
      </div>
    </div>
  );
}
