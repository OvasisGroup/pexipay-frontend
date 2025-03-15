"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLoading } from "@/providers/LoadingProvider";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  BellIcon,
  Settings,
  LogOut,
  Search,
  Home,
  Users,
  CreditCard,
  DollarSign,
  Menu,
  X,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isLoading, setLoading } = useLoading();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Merchants", href: "/dashboard/merchants" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const handleNavigation = (href: string) => {
    setLoading(true);
    setIsSidebarOpen(false);
    router.push(href);
    setLoading(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-64 bg-white shadow-sm fixed h-full z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 ml-4 bg-black w-full p-4 rounded-md"
          >
            <Image
              src="/images/logo.png"
              alt="Pexi Pay"
              width={100}
              height={100}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
              className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
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
                      <span className="text-sm text-gray-500">
                        {user?.email}
                      </span>
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

        {/* Main Content Area */}
        <main className="pt-20 px-4 md:px-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
