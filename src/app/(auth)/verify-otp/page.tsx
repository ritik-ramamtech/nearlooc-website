"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) router.replace(ROUTES.FORGOT_PASSWORD);
  }, [email, router]);

  if (!email) return null;

  return (
    <>
      <h2 className="mb-6 text-headline-sm font-semibold text-on-surface">Verify Code</h2>
      <VerifyOtpForm email={email} />
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-stitch-primary" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
