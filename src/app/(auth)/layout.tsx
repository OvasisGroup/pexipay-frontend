import { AuthNavbar } from "@/components/AuthNavbar";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
        {children}
    </div>
  );
}
