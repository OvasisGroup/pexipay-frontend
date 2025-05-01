"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CodeExamplesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Code Examples</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common Integration Scenarios</h2>
        <p className="text-gray-600">
          Here are some common integration scenarios and how to implement them
          using our SDK.
        </p>
      </section>

      <Tabs defaultValue="checkout">
        <TabsList>
          <TabsTrigger value="checkout">Checkout Form</TabsTrigger>
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          <TabsTrigger value="error">Error Handling</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Checkout Form Integration</h3>
            <p className="text-gray-600">
              Implement a secure checkout form using our React components:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import { PaymentForm, usePayment } from '@payment-gateway/react';

export function CheckoutForm() {
  const { processPayment, loading, error } = usePayment();

  const handleSubmit = async (formData) => {
    try {
      const payment = await processPayment({
        amount: formData.amount,
        currency: 'USD',
        payment_method: formData.paymentMethod,
      });
      
      // Handle successful payment
      console.log('Payment successful:', payment.id);
    } catch (error) {
      // Handle payment error
      console.error('Payment failed:', error.message);
    }
  };

  return (
    <PaymentForm
      onSubmit={handleSubmit}
      amount={1000}
      currency="USD"
      loading={loading}
      error={error}
    />
  );
}`}
            />
          </section>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Subscription Management</h3>
            <p className="text-gray-600">
              Handle recurring payments and subscription lifecycle:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import { PaymentGateway } from '@payment-gateway/node';

const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
});

// Create a subscription
async function createSubscription(customerId, planId) {
  const subscription = await gateway.subscriptions.create({
    customer: customerId,
    plan: planId,
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
  return subscription;
}

// Update subscription
async function updateSubscription(subscriptionId, updates) {
  const subscription = await gateway.subscriptions.update(subscriptionId, updates);
  return subscription;
}

// Cancel subscription
async function cancelSubscription(subscriptionId) {
  await gateway.subscriptions.cancel(subscriptionId);
}`}
            />
          </section>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Webhook Integration</h3>
            <p className="text-gray-600">
              Handle asynchronous payment events using webhooks:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import express from 'express';
import { PaymentGateway } from '@payment-gateway/node';

const app = express();
const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
});

app.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['payment-gateway-signature'];

  try {
    const event = gateway.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment.succeeded':
        await handleSuccessfulPayment(event.data);
        break;
      case 'payment.failed':
        await handleFailedPayment(event.data);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      default:
        console.log(\`Unhandled event type: \${event.type}\`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
});`}
            />
          </section>
        </TabsContent>

        <TabsContent value="error" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-medium">Error Handling</h3>
            <p className="text-gray-600">
              Implement robust error handling for different scenarios:
            </p>
            <CodeBlock
              language="typescript"
              code={`
import { PaymentGateway, PaymentError } from '@payment-gateway/node';

const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
});

async function processPaymentWithErrorHandling(paymentData) {
  try {
    const payment = await gateway.payments.create(paymentData);
    return payment;
  } catch (error) {
    if (error instanceof PaymentError) {
      switch (error.code) {
        case 'card_declined':
          throw new Error('The card was declined. Please try another card.');
        case 'expired_card':
          throw new Error('The card has expired. Please use a different card.');
        case 'insufficient_funds':
          throw new Error('The card has insufficient funds.');
        case 'invalid_cvc':
          throw new Error('The CVC number is invalid.');
        default:
          throw new Error('An error occurred while processing your payment.');
      }
    }
    
    // Handle other types of errors
    throw new Error('An unexpected error occurred.');
  }
}`}
            />
          </section>
        </TabsContent>
      </Tabs>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Always validate input data before making API calls</li>
          <li>Implement proper error handling for all API interactions</li>
          <li>Use environment variables for sensitive data</li>
          <li>Set up logging for debugging and monitoring</li>
          <li>Implement retry logic for failed requests</li>
          <li>Keep your SDK version up to date</li>
        </ul>
      </section>

      <div className="flex justify-between mt-8">
        <a
          href="/documentations/guides/quick-start"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Quick Start
        </a>
        <a
          href="/documentations/guides/testing"
          className="text-primary hover:underline font-medium"
        >
          Next: Testing Guide →
        </a>
      </div>
    </div>
  );
}
