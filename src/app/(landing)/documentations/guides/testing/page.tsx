"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestingGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Testing Guide</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-600">
          Our payment gateway provides a comprehensive testing environment to
          help you validate your integration before going live. This guide
          covers different testing scenarios and best practices.
        </p>
      </section>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Test Cards</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Testing</TabsTrigger>
          <TabsTrigger value="integration">Integration Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Test Card Numbers</h3>
            <p className="text-gray-600">
              Use these card numbers to test different payment scenarios:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Successful Payments</h4>
                <CodeBlock
                  language="plaintext"
                  code={`
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005`}
                />
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Failed Payments</h4>
                <CodeBlock
                  language="plaintext"
                  code={`
Declined: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Expired Card: 4000 0000 0000 0069`}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-medium">Test Card Authentication</h3>
            <p className="text-gray-600">
              For 3D Secure authentication testing:
            </p>
            <CodeBlock
              language="plaintext"
              code={`
3D Secure Required: 4000 0000 0000 3220
3D Secure Success: 4000 0000 0000 3063
3D Secure Failure: 4000 0000 0000 3063

Use any future expiration date
CVC: Any 3 digits (4 for American Express)
ZIP: Any 5 digits`}
            />
          </section>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Testing Webhooks</h3>
            <p className="text-gray-600">
              Test your webhook integration using our webhook simulator:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import { PaymentGateway } from '@payment-gateway/node';

const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_TEST_KEY,
});

// Simulate a webhook event
async function simulateWebhook() {
  const event = await gateway.webhooks.simulate({
    type: 'payment.succeeded',
    data: {
      id: 'pay_test_123',
      amount: 1000,
      currency: 'USD',
      status: 'succeeded',
    },
  });

  console.log('Simulated webhook event:', event);
}

// Test webhook signature verification
function verifyWebhookSignature(payload, signature) {
  try {
    const event = gateway.webhooks.constructEvent(
      payload,
      signature,
      process.env.WEBHOOK_SECRET
    );
    return true;
  } catch (error) {
    console.error('Invalid signature:', error.message);
    return false;
  }
}`}
            />
          </section>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Integration Testing</h3>
            <p className="text-gray-600">
              Example of a complete integration test suite:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import { PaymentGateway } from '@payment-gateway/node';
import { expect } from 'chai';

describe('Payment Integration Tests', () => {
  const gateway = new PaymentGateway({
    apiKey: process.env.PAYMENT_GATEWAY_TEST_KEY,
  });

  it('should process a successful payment', async () => {
    const payment = await gateway.payments.create({
      amount: 1000,
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
    });

    expect(payment.status).to.equal('succeeded');
    expect(payment.amount).to.equal(1000);
  });

  it('should handle a declined payment', async () => {
    try {
      await gateway.payments.create({
        amount: 1000,
        currency: 'USD',
        payment_method: {
          type: 'card',
          card: {
            number: '4000000000000002',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123',
          },
        },
      });
    } catch (error) {
      expect(error.code).to.equal('card_declined');
    }
  });
});`}
            />
          </section>
        </TabsContent>
      </Tabs>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Testing Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Always use test API keys for development and testing</li>
          <li>Test all possible payment scenarios (success, failure, etc.)</li>
          <li>Implement proper error handling and test error scenarios</li>
          <li>Test webhook integration thoroughly</li>
          <li>Use automated testing for critical payment flows</li>
          <li>Test currency conversions and international payments</li>
        </ul>
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/guides/code-examples"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Code Examples
        </a>
        <a
          href="/documentations"
          className="text-primary hover:underline font-medium"
        >
          Back to Documentation Home →
        </a>
      </div>
    </div>
  );
}
