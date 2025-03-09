"use client";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-600">No transactions yet</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Merchants</h2>
          <p className="text-gray-600">No merchants yet</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
      </div>
    </div>
  );
}
