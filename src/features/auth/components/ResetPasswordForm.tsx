"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerError } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useResetPassword } from "../hooks";
import { resetPasswordSchema, type ResetPasswordInput } from "../types";

export function ResetPasswordForm({ email, otp }: { email: string; otp: string }) {
  const { mutate, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const serverError = getServerError(error);

  const onSubmit = (data: ResetPasswordInput) => {
    mutate({ email, otp, ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">New Password</label>
        <Input
          type="password"
          placeholder="new password"
          autoComplete="new-password"
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-label-sm text-bg-error">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Confirm Password</label>
        <Input
          type="password"
          placeholder="confirm password"
          autoComplete="new-password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-label-sm text-bg-error">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
      </Button>

      <p className="text-center text-body-sm text-on-surface-variant">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="font-medium text-stitch-primary hover:underline"
        >
          Change email
        </Link>
      </p>
    </form>
  );
}
