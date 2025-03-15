"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
export function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold bg-black p-4 rounded-md"
            >
              <Image
                src="/images/logo.png"
                alt="Pexi Pay"
                width={100}
                height={100}
              />
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
