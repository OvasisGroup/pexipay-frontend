"use client";
import Image from "next/image";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div  className="grid md:grid-cols-2 h-screen">
      <div className="bg-[url('/images/bgImagetwo.jpg')] bg-cover bg-center p-10 flex flex-col justify-end max-[200px]:">
      <Image src="/images/SVG/pexi-white.svg" alt="logo" width={180} height={100} className="mb-4"/>
      <p className="text-white text-sm bottom-6">We tap into modern payment methods that help your business grow. We help you accept global debit and credit card payments for all card brands and local payment methods.</p>
      </div>

      <div className="flex flex-col justify-center items-center" >
        <h1 className="text-3xl font-bold tracking-tight text-blue-900 mt-4">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Enter your details below to create your account
        </p>
        <RegisterForm />
      </div>
      
    </div>
  );
}
