import { CodeBlock } from "@/components/CodeBlock";

export default function AuthenticationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Authentication</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Keys</h2>
        <p className="text-gray-600">
          All API requests require authentication using an API key. You can
          obtain your API keys from the dashboard after registration. We provide
          two types of API keys:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>Test API keys - for development and testing</li>
          <li>Live API keys - for production use</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Making Authenticated Requests
        </h2>
        <p className="text-gray-600">
          Include your API key in the Authorization header of all API requests:
        </p>
        <CodeBlock
          language="bash"
          code={`
# Example API request with authentication
curl -X POST https://api.payment-gateway.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "USD",
    "description": "Test payment"
  }'`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Key Security</h2>
        <div className="space-y-2 text-gray-600">
          <p>Follow these best practices to keep your API keys secure:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Never share your API keys publicly or commit them to version
              control
            </li>
            <li>
              Use environment variables to store API keys in your application
            </li>
            <li>Rotate your API keys periodically</li>
            <li>Use test API keys for development and testing</li>
          </ul>
        </div>
        <CodeBlock
          language="typescript"
          code={`
// Example of using API key with environment variables
const apiKey = process.env.PAYMENT_GATEWAY_API_KEY;
const response = await fetch('https://api.payment-gateway.com/v1/payments', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json',
  },
});`}
        />
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/introduction"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Introduction
        </a>
        <a
          href="/documentations/api/merchants"
          className="text-primary hover:underline font-medium"
        >
          Next: Merchants API →
        </a>
      </div>
    </div>
  );
}
