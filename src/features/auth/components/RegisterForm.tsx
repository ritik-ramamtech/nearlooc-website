"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerError } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useRegister } from "../hooks";
import { registerSchema, type RegisterInput } from "../types";
import { GoogleButton } from "./GoogleButton";

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const serverError = getServerError(error);

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Full Name</label>
        <Input placeholder="John Doe" autoComplete="name" {...register("name")} />
        {errors.name && (
          <p className="text-label-sm text-bg-error">{errors.name.message}</p>
        )}
      </div>

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

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Password</label>
        <Input
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-label-sm text-bg-error">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Confirm Password</label>
        <Input
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && (
          <p className="text-label-sm text-bg-error">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-label-sm text-on-surface-variant">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <p className="text-center text-body-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-stitch-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
