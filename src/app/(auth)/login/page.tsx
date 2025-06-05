import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-[url('/images/bgImage.jpg')] bg-cover bg-center p-10 flex flex-col justify-end max-[200px]:">
      <Image src="/images/SVG/pexi-white.svg" alt="logo" width={180} height={100} className="mb-4"/>
      <p className="text-white text-sm bottom-6">We tap into modern payment methods that help your business grow. We help you accept global debit and credit card payments for all card brands and local payment methods.</p>
      </div>
      <div className="flex flex-col space-y-2 h-screen items-center justify-center w-full">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900 mt-4">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
