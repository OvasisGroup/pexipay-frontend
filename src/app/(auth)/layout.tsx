import { AuthNavbar } from "@/components/AuthNavbar";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      <main className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg mx-auto shadow-lg border bg-white/90 backdrop-blur-md">
          <CardContent className="py-8 px-6 sm:px-8">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}
