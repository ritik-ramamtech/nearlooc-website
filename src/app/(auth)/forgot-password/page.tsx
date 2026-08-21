import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="mb-2 text-headline-sm font-semibold text-on-surface">
        Forgot Password?
      </h2>
      <p className="mb-6 text-body-sm text-on-surface-variant">
        Enter the email associated with your account and we&apos;ll send you a code to reset
        your password.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
