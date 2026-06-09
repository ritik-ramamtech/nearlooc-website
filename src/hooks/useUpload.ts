"use client";

import { useState } from "react";
import apiClient from "@/lib/api-client";

interface UploadResult {
  url: string;
}

export function useUpload(endpoint: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setIsPending(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.post<UploadResult>(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch {
      setError("Upload failed. Please try again.");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  return { upload, isPending, error };
}
