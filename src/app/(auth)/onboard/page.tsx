"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">
            Create an account
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Enter your details below to create your account
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
