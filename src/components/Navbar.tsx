"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, UserIcon, LogOut } from "lucide-react";

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

export function DashboardNavbar({
  user,
  handleLogout,
  toggleSidebar,
}: {
  user: any;
  handleLogout: () => void;
  toggleSidebar: () => void;
}) {
  return (
    <nav className="bg-white shadow-sm h-16 fixed w-full lg:w-[calc(100%-16rem)] z-20">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Menu Toggle for Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 bg-gray-50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.firstName?.[0]}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{`${user?.firstName} ${user?.lastName}`}</span>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  <UserIcon className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
