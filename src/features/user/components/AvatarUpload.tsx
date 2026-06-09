"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpload } from "@/hooks/useUpload";
import { useUpdateProfile } from "../hooks";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface AvatarUploadProps {
  name: string;
  avatarUrl: string | null;
}

export function AvatarUpload({ name, avatarUrl }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isPending: uploading } = useUpload("/upload/user/avatar");
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
  const [validationError, setValidationError] = useState<string | null>(null);

  const isPending = uploading || saving;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError("Only JPEG, PNG, WebP, or GIF images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

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
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stitch-primary text-white shadow-md disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        className="hidden"
        onChange={handleFile}
      />
      {validationError ? (
        <p className="text-label-sm text-red-500">{validationError}</p>
      ) : (
        <p className="text-label-sm text-on-surface-variant">Tap to change photo</p>
      )}
    </div>
  );
}
