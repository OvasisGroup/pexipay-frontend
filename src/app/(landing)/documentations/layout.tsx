"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/documentations/introduction" },
      { title: "Authentication", href: "/documentations/authentication" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Merchants", href: "/documentations/api/merchants" },
      { title: "Payments", href: "/documentations/api/payments" },
      { title: "Currencies", href: "/documentations/api/currencies" },
    ],
  },
  {
    title: "Integration Guide",
    items: [
      { title: "Quick Start", href: "/documentations/guides/quick-start" },
      { title: "Code Examples", href: "/documentations/guides/code-examples" },
      { title: "Testing", href: "/documentations/guides/testing" },
    ],
  },
];

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <nav className="p-4 space-y-8">
          <div className="sticky top-0">
            <Link href="/documentations" className="block">
              <h2 className="text-lg font-semibold mb-4">Documentation</h2>
            </Link>
            <div className="space-y-6">
              {sidebarItems.map((section) => (
                <div key={section.title}>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className={cn(
                            "text-sm block py-1",
                            pathname === item.href
                              ? "text-primary font-medium"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="py-6">{children}</div>
      </main>
    </div>
  );
}
