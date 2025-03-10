"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Pexi Pay
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
                Welcome, {user.firstName} {user.lastName}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
