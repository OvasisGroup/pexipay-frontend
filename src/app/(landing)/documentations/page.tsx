"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/CodeBlock";

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">Payment Gateway Documentation</h1>
        <p className="text-lg text-gray-600">
          Welcome to our payment gateway integration guide. This documentation
          will help you integrate our payment processing solution into your
          application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Getting Started */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/documentations/introduction"
                  className="text-primary hover:underline"
                >
                  Introduction
                </a>
              </li>
              <li>
                <a
                  href="/documentations/authentication"
                  className="text-primary hover:underline"
                >
                  Authentication
                </a>
              </li>
            </ul>
          </div>

          {/* API Reference */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">API Reference</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/documentations/api/merchants"
                  className="text-primary hover:underline"
                >
                  Merchants API
                </a>
              </li>
              <li>
                <a
                  href="/documentations/api/payments"
                  className="text-primary hover:underline"
                >
                  Payments API
                </a>
              </li>
              <li>
                <a
                  href="/documentations/api/currencies"
                  className="text-primary hover:underline"
                >
                  Currencies API
                </a>
              </li>
            </ul>
          </div>

          {/* Integration Guide */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Integration Guide</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/documentations/guides/quick-start"
                  className="text-primary hover:underline"
                >
                  Quick Start
                </a>
              </li>
              <li>
                <a
                  href="/documentations/guides/code-examples"
                  className="text-primary hover:underline"
                >
                  Code Examples
                </a>
              </li>
              <li>
                <a
                  href="/documentations/guides/testing"
                  className="text-primary hover:underline"
                >
                  Testing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
