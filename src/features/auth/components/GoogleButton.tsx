import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/constants";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.4 2.1-6.9 2.1-5.3 0-9.6-3.5-11.2-8.2l-6.5 5C9.8 39.1 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6 5c3.5-3.2 5.9-8 5.9-14.6 0-1.2-.1-2.4-.3-3.5z"
      />
    </svg>
  );
}

export function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={() => {
        window.location.href = `${API_BASE_URL}/auth/google`;
      }}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
