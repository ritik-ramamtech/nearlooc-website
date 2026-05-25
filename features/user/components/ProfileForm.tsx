"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "../hooks";
import type { UserProfile } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { mutate, isPending, error, isSuccess } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: profile.name, phone: profile.phone ?? "" },
  });

  useEffect(() => {
    reset({ name: profile.name, phone: profile.phone ?? "" });
  }, [profile, reset]);

  const serverError = error && "response" in error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
    : null;

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}
      {isSuccess && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Profile updated!</p>
      )}

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Full Name</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-label-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Email</label>
        <Input value={profile.email} disabled className="opacity-60" />
        <p className="text-label-sm text-on-surface-variant">Email cannot be changed</p>
      </div>

      <div className="space-y-1">
        <label className="text-label-md text-on-surface-variant">Phone</label>
        <Input type="tel" placeholder="+91 98765 43210" {...register("phone")} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
      </Button>
    </form>
  );
}
