import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

interface Props {
  searchParams: Promise<{ email?: string; otp?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { email, otp } = await searchParams;

  if (!email || !otp) redirect(ROUTES.FORGOT_PASSWORD);

  return (
    <>
      <h2 className="mb-2 text-headline-sm font-semibold text-on-surface">Reset Password</h2>
      <p className="mb-6 text-body-sm text-on-surface-variant">
        Create a new password for your account.
      </p>
      <ResetPasswordForm email={email} otp={otp} />
    </>
  );
}
