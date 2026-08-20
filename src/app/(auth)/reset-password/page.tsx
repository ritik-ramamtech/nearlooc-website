"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  useEffect(() => {
    if (!email || !otp) router.replace(ROUTES.FORGOT_PASSWORD);
  }, [email, otp, router]);

  if (!email || !otp) return null;

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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-stitch-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
