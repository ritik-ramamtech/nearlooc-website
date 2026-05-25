"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpload } from "@/hooks/useUpload";
import { useUpdateProfile } from "../hooks";

interface AvatarUploadProps {
  name: string;
  avatarUrl: string | null;
}

export function AvatarUpload({ name, avatarUrl }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isPending: uploading } = useUpload("/upload/user/avatar");
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();

  const isPending = uploading || saving;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) updateProfile({ avatar_url: url });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback className="bg-stitch-primary/10 text-stitch-primary text-headline-sm font-bold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stitch-primary text-white shadow-md"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="text-label-sm text-on-surface-variant">Tap to change photo</p>
    </div>
  );
}
