"use client";
import { CodeBlock } from "@/components/CodeBlock";

export default function QuickStartGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Quick Start Guide</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Create an account on our platform</li>
          <li>Obtain your API keys from the dashboard</li>
          <li>Basic understanding of REST APIs</li>
          <li>A development environment with Node.js installed</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p className="text-gray-600">
          Install our official Node.js library using npm:
        </p>
        <CodeBlock language="bash" code={`npm install @payment-gateway/node`} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Setup</h2>
        <p className="text-gray-600">
          Initialize the client with your API key:
        </p>
        <CodeBlock
          language="typescript"
          code={`
import { PaymentGateway } from '@payment-gateway/node';

const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
  environment: 'test', // or 'production' for live payments
});`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Create Your First Payment</h2>
        <p className="text-gray-600">
          Here's a complete example of processing a payment:
        </p>
        <CodeBlock
          language="typescript"
          code={`
import { PaymentGateway } from '@payment-gateway/node';

// Initialize the client
const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
  environment: 'test',
});

// Process a payment
async function processPayment() {
  try {
    const payment = await gateway.payments.create({
      amount: 1000, // Amount in cents
      currency: 'USD',
      payment_method: {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      },
      description: 'Test payment',
    });

    console.log('Payment processed successfully:', payment.id);
    return payment;
  } catch (error) {
    console.error('Payment processing failed:', error.message);
    throw error;
  }
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Next Steps</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            After completing this quick start guide, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Explore our comprehensive API documentation</li>
            <li>Implement error handling and webhooks</li>
            <li>Set up recurring payments</li>
            <li>Configure multiple payment methods</li>
            <li>Test different scenarios using our test cards</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Testing</h2>
        <p className="text-gray-600">
          Use these test card numbers to simulate different scenarios:
        </p>
        <CodeBlock
          language="plaintext"
          code={`
Test Card Numbers:
4242 4242 4242 4242 - Successful payment
4000 0000 0000 0002 - Declined payment
4000 0000 0000 9995 - Insufficient funds
4000 0000 0000 3220 - 3D Secure authentication required`}
        />
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/api/currencies"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Currencies API
        </a>
        <a
          href="/documentations/guides/code-examples"
          className="text-primary hover:underline font-medium"
        >
          Next: Code Examples →
        </a>
      </div>
    </div>
  );
}
