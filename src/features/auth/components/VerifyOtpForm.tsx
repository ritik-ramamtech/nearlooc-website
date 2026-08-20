"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerError } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useForgotPassword, useVerifyOtp } from "../hooks";
import { verifyOtpSchema, type VerifyOtpInput } from "../types";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const { mutate: verify, isPending, error } = useVerifyOtp();
  const { mutate: resend, isPending: isResending } = useForgotPassword();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpInput>({ resolver: zodResolver(verifyOtpSchema) });

  const serverError = getServerError(error);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = (data: VerifyOtpInput) => {
    verify(
      { email, otp: data.otp },
      {
        onSuccess: () =>
          router.push(
            `${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${data.otp}`,
          ),
      },
    );
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    setResendMessage(null);
    resend(email, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_SECONDS);
        setResendMessage("Code resent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-center text-body-sm text-on-surface-variant">
        Enter the 6-digit code we sent to{" "}
        <span className="font-semibold text-on-surface">{email}</span>
      </p>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}
      {resendMessage && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {resendMessage}
        </p>
      )}

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Code</label>
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          autoComplete="one-time-code"
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-label-sm text-bg-error">{errors.otp.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
      </Button>

      <button
        type="button"
        onClick={handleResend}
        disabled={cooldown > 0 || isResending}
        className="w-full text-center text-sm font-medium text-stitch-primary disabled:cursor-not-allowed disabled:text-on-surface-variant"
      >
        {cooldown > 0
          ? `Resend code in ${cooldown}s`
          : isResending
            ? "Resending..."
            : "Didn't get the code? Resend"}
      </button>
    </form>
  );
}
