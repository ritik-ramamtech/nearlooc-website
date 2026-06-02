"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks";
import { loginSchema, type LoginInput } from "../types";

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const serverError =
    error && "response" in error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : null;

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
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

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-label-sm text-bg-error">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>

      <p className="text-center text-body-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-stitch-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
