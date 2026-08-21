"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerError } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useForgotPassword } from "../hooks";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../types";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const serverError = getServerError(error);

  const onSubmit = (data: ForgotPasswordInput) => {
    mutate(data.email, {
      onSuccess: () =>
        router.push(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(data.email)}`),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-label-sm text-bg-error">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Code"}
      </Button>

      <p className="text-center text-body-sm text-on-surface-variant">
        Remembered your password?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-stitch-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
