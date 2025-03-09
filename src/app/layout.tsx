import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/providers/AuthProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pexi Pay",
  description: "Pexi Pay - Your payment partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
