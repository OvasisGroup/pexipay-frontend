export default function IntroductionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Introduction</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-600">
          Our payment gateway provides a robust and secure way to process
          payments in your application. With support for multiple currencies and
          merchants, you can easily handle transactions across different
          regions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Secure payment processing</li>
          <li>Multi-currency support</li>
          <li>Merchant management</li>
          <li>Comprehensive API</li>
          <li>Detailed transaction reporting</li>
          <li>Test environment for development</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Getting Started</h2>
        <p className="text-gray-600">
          To start using our payment gateway, you'll need to:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Create an account and get your API credentials</li>
          <li>Set up your merchant profile</li>
          <li>Configure supported currencies</li>
          <li>Integrate our API into your application</li>
        </ol>
      </section>

      <div className="mt-8">
        <a
          href="/documentations/authentication"
          className="text-primary hover:underline font-medium"
        >
          Next: Authentication →
        </a>
      </div>
    </div>
  );
}
