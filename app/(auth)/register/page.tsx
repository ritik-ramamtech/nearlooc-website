import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-headline-sm font-semibold text-on-surface">Create your account</h2>
      <RegisterForm />
    </>
  );
}
