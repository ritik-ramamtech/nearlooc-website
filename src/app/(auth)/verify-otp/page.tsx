import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export const metadata: Metadata = { title: "Verify Code" };

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) redirect(ROUTES.FORGOT_PASSWORD);

  return (
    <>
      <h2 className="mb-6 text-headline-sm font-semibold text-on-surface">Verify Code</h2>
      <VerifyOtpForm email={email} />
    </>
  );
}
