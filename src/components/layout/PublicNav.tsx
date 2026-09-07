"use client";

import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  User,
  Heart,
  Store,
  Smartphone,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  MapPin,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  LocateFixed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/hooks";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/store/location.store";
import {
  useSavedAddresses,
  useUpdateActiveAddress,
  useUpdateLocation,
} from "@/features/user/hooks";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "../ui/toast";
import { reverseGeocode } from "@/lib/location";

const STORAGE_KEY = "nearlooc_location_set";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function LocationDialog({ open, onOpenChange }: LocationDialogProps) {
  const { location: currentLocation, setLocation } = useLocationStore();
  const { isAuthenticated } = useAuthStore();
  const { mutate: updateAddress, isPending } = useUpdateActiveAddress();
  const { data: savedAddresses } = useSavedAddresses(isAuthenticated);
  const { mutate: updateLocation } = useUpdateLocation();

  const router = useRouter();

  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  const handleSelectAddress = (address: any) => {
    updateAddress(address.id, {
      onSuccess: () => {
        setLocation({
          latitude: address.latitude,
          longitude: address.longitude,
          address: [address.street, address.city, address.state].join(", "),
          display_name: address.label,
          source: "saved",
          address_id: address.id,
        });
        localStorage.setItem(STORAGE_KEY, "address");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Couldn't switch address, Please try again.");
      },
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const location = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            display_name: location.displayName,
            address: [
              location.street,
              location.city,
              location.state,
              location.postalCode,
            ].join(", "),
            source: "gps",
          });
          localStorage.setItem(STORAGE_KEY, "set");
          if (isAuthenticated) {
            updateLocation(
              {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                display_name: location.displayName,
              },
              { onSuccess: () => onOpenChange(false) },
            );
          } else {
            onOpenChange(false);
          }
        } catch {
          setGeoError("Couldn't detect your location. Please try again.");
        } finally {
          setDetecting(false);
        }
      },
      async (error) => {
        setDetecting(false);

        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState("denied");
          setGeoError("Location access was denied.");
        } else if (error.code === error.TIMEOUT) {
          setGeoError("Couldn't detect your location. Please try again.");
        } else {
          setGeoError("Couldn't detect your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // reuse GPS for 5 mins if available
      },
    );
  };

  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      setPermissionState(permission.state);
      permission.onchange = () => setPermissionState(permission.state);
    });
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50
            w-[400px] max-w-[calc(100vw-2rem)]
            -translate-x-1/2 -translate-y-1/2
            overflow-hidden rounded-2xl bg-white shadow-2xl
            focus:outline-none
          "
        >
          {isPending && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <div className="rounded-full bg-white p-2 shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-stitch-primary" />
              </div>
            </div>
          )}

          <div className="border-b px-6 py-3">
            <Dialog.Title className=" font-semibold text-gray-900">
              Choose your location
            </Dialog.Title>

            <Dialog.Description className="mt-1 text-xs text-gray-500">
              Delivery availability depends on your location.
            </Dialog.Description>

            <Dialog.Close asChild>
              <button className="absolute right-5 top-5 rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="max-h-[480px] overflow-y-auto px-4 py-2">
            {/* Current location */}

            {permissionState !== "denied" && (
              <button onClick={detectLocation} disabled={detecting} className="flex gap-2 mb-2">
                {detecting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-stitch-primary" />
                ) : (
                  <LocateFixed className="h-5 w-5 text-stitch-primary" />
                )}

                <div className="flex flex-col justify-start">
                  <p className="text-sm font-semibold">
                    {detecting
                      ? "Detecting location..."
                      : "Detect current location"}
                  </p>
                </div>
              </button>
            )}

            {currentLocation?.source === "gps" && (
              <div
                className={`rounded-xl border px-4 py-2 hover:border-stitch-primary transition cursor-pointer ${currentLocation?.source === "gps" ? "bg-emerald-50 border-emerald-400 border-2" : ""} `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          Current Location
                        </p>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          LIVE
                        </span>
                      </div>

                      <p className="mt-0 text-xs">
                        {currentLocation?.display_name}
                      </p>
                    </div>
                  </div>

                  {currentLocation?.source === "gps" && (
                    <CheckCircle2 className="h-5 w-5 text-stitch-primary" />
                  )}
                </div>
              </div>
            )}

            {geoError && (
              <p className="mt-2 px-1 text-xs text-red-500">{geoError}</p>
            )}

            {/* Saved addresses */}

            <div className=" pt-3 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Saved Addresses
              </p>
            </div>

            {savedAddresses?.map((address) => (
              <button
                key={address.id}
                className={`flex w-full items-start gap-4 px-4 py-2.5 text-left border rounded-xl transition hover:bg-gray-50 ${
                  address.is_active && currentLocation?.source === "saved"
                    ? "bg-emerald-50 border-emerald-400 border-2"
                    : ""
                }`}
                onClick={() => handleSelectAddress(address)}
                disabled={isPending}
              >
                {/* <div className="rounded-full bg-gray-100 p-2.5">
                  <Home className="h-4 w-4 text-gray-600" />
                </div> */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{address.label}</p>

                    {address.is_active &&
                      currentLocation?.source === "saved" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                  </div>

                  <p className="mt-0 line-clamp-2 text-xs">
                    {address.street}, {address.city}, {address.state}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t bg-gray-50 p-4">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl"
              disabled={isPending}
              onClick={() => router.replace("/profile/location")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchBar({
  autoFocus,
  className,
  onSubmit: onSubmitProp,
}: {
  autoFocus?: boolean;
  className?: string;
  onSubmit?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAiMode, setIsAiMode] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear the box once we've navigated away from a search results page
  useEffect(() => {
    if (pathname !== "/offers" && pathname !== "/search") {
      setQuery("");
    }
  }, [pathname]);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  function handleSubmit(e?: React.SubmitEvent<HTMLFormElement>) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSubmitProp?.();
    if (isAiMode) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/offers?search=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center w-full", className)}
    >
      {/* Left icon — swaps between Search and Sparkles with entrance animation */}
      <div className="absolute left-4 pointer-events-none">
        {isAiMode ? (
          <Sparkles
            key="ai-left"
            className="h-4 w-4 text-violet-500 animate-sparkle-in"
          />
        ) : (
          <Search
            key="search-left"
            className="h-4 w-4 text-gray-400 animate-pop-in"
          />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "w-full h-11 rounded-full border py-2 pl-10 pr-28 text-sm focus:outline-none transition-all duration-200",
          isAiMode
            ? "bg-violet-50/60 border-violet-300 text-gray-900 placeholder-violet-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            : "bg-gray-50/50 border-gray-200/80 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-stitch-secondary focus:ring-2 focus:ring-stitch-secondary/20",
        )}
        placeholder={
          isAiMode
            ? "Ask AI — find the best deals near you..."
            : "Search deals, vendors, products..."
        }
      />

      {/* AI toggle pill */}
      <button
        type="button"
        onClick={() => setIsAiMode((v) => !v)}
        aria-label={
          isAiMode ? "Switch to normal search" : "Switch to AI search"
        }
        className={cn(
          "absolute right-[46px] flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all duration-200",
          isAiMode
            ? "bg-violet-600 text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
        )}
      >
        <Sparkles
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isAiMode && "animate-sparkle-in",
          )}
        />
        <span>AI</span>
      </button>

      {/* Submit button */}
      <button
        type="submit"
        aria-label="Submit search"
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all duration-200",
          isAiMode
            ? "bg-violet-600 hover:bg-violet-700"
            : "bg-stitch-secondary hover:bg-stitch-primary",
        )}
      >
        {isAiMode ? (
          <Sparkles key="ai-submit" className="h-4 w-4 animate-sparkle-in" />
        ) : (
          <Search key="search-submit" className="h-4 w-4 animate-pop-in" />
        )}
      </button>
    </form>
  );
}

function NavbarLocation({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { location } = useLocationStore();

  return (
    <button
      className="hidden lg:flex items-center gap-2 px-0 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={() => setOpen(true)}
    >
      <MapPin className="h-5 w-5 text-stitch-primary shrink-0" />

      <div className="min-w-0 text-left leading-tight">
        <p className="text-[10px] text-gray-500">Deliver to</p>

        <p className="truncate text-sm font-semibold text-gray-900 max-w-[170px]">
          {location?.display_name ?? "Select your location"}
        </p>
      </div>
    </button>
  );
}

export function PublicNav() {
  const { isAuthenticated, merchant_id, user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-4">
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="shrink-0 p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <SearchBar
              autoFocus
              className="flex-1"
              onSubmit={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      <header className="fixed top-0 z-[60] w-full border-b border-gray-100 bg-white px-4">
        <div className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href={ROUTES.HOME} className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Nearlooc"
              width={160}
              height={42}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <NavbarLocation setOpen={setOpen} />

          <LocationDialog open={open} onOpenChange={setOpen} />

          {/* Search Bar — desktop only */}
          <div className="flex-1 max-w-[420px] ml-4 mr-auto hidden md:block">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {/* Mobile search button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-1.5 text-gray-700 hover:text-stitch-secondary transition-colors md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* App link */}
            <Link
              href="#"
              className="flex items-center gap-1.5 text-stitch-secondary font-semibold text-sm hover:opacity-80 transition-opacity"
              aria-label="Download mobile app"
            >
              <Smartphone className="h-5 w-5 text-stitch-secondary" />
              <span className="hidden lg:inline">App</span>
            </Link>

            {/* Sell on NearLooc — desktop only, hidden for merchants */}
            {!merchant_id && (
              <>
                <div className="hidden lg:block h-4 w-px bg-gray-200" />
                <Link
                  href={ROUTES.PROFILE_BECOME_MERCHANT}
                  className="hidden lg:flex items-center gap-1.5 text-stitch-secondary font-semibold text-sm hover:opacity-80 transition-opacity"
                >
                  <Store className="h-4.5 w-4.5 text-stitch-secondary" />
                  <span>Sell on NearLooc</span>
                </Link>
              </>
            )}

            <div className="hidden lg:block h-4 w-px bg-gray-200" />

            {/* Wishlist */}
            <Link
              href={ROUTES.FAVORITES}
              className="hidden sm:flex items-center gap-1.5 text-gray-700 font-semibold text-sm hover:text-stitch-secondary transition-colors"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5 sm:h-4.5 sm:w-4.5 text-gray-700" />
              <span className="hidden lg:inline">Wishlist</span>
            </Link>

            {/* Notifications */}
            <Link
              href={ROUTES.NOTIFICATIONS}
              className="relative p-1.5 text-gray-700 hover:text-stitch-secondary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* User section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-gray-50 hover:bg-gray-100/80 px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors focus:outline-none"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    {user?.avatar_url ? (
                      <img
                        src={user?.avatar_url}
                        className=" rounded-full w-full h-full"
                      />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="max-w-[80px] truncate hidden sm:inline">
                    Hi, {user?.name.split(" ")[0] ?? "User"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 hidden sm:inline" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    {merchant_id ? (
                      <Link
                        href={ROUTES.DASHBOARD}
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Store className="h-4 w-4" />
                        Merchant Portal
                      </Link>
                    ) : (
                      <Link
                        href={ROUTES.PROFILE_BECOME_MERCHANT}
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Store className="h-4 w-4" />
                        Sell on NearLooc
                      </Link>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      disabled={isPending}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href={ROUTES.LOGIN} className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 font-semibold text-sm"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="sm"
                    className="bg-stitch-secondary text-white hover:bg-stitch-primary px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
