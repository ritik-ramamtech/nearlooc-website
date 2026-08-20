"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) router.replace(ROUTES.REGISTER);
  }, [email, router]);

  if (!email) return null;

  return (
    <>
      <h2 className="mb-2 text-headline-sm font-semibold text-on-surface">Verify Your Email</h2>
      <p className="mb-6 text-body-sm text-on-surface-variant">
        Almost there! Confirm your email to activate your account.
      </p>
      <VerifyEmailForm email={email} />
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-stitch-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
