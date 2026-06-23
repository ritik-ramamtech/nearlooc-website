"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerError } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useLogin } from "../hooks";
import { loginSchema, type LoginInput } from "../types";
import { GoogleButton } from "./GoogleButton";

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const serverError = getServerError(error);
  const [googleError, setGoogleError] = useState(false);

  useEffect(() => {
    setGoogleError(new URLSearchParams(window.location.search).get("error") === "google_login_failed");
  }, []);

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
      {googleError && !serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Google sign-in failed. Please try again.
        </p>
      )}
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-label-sm text-on-surface-variant">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <p className="text-center text-body-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-stitch-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
