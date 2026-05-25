import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-6 text-headline-sm font-semibold text-on-surface">Welcome back</h2>
      <LoginForm />
    </>
  );
}
