"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Store,
  Sparkles,
  Gift,
  Percent,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  /** Background photo (Unsplash). Falls back to the gradient if it fails to load. */
  image: string;
  /** Tailwind gradient classes blended over the photo for brand consistency. */
  gradient: string;
}

/**
 * Promotional hero content lives here — these are marketing banners, not a
 * backend resource, so they are intentionally defined in the client.
 */
const SLIDES: Slide[] = [
  {
    eyebrow: "Mega Savings",
    title: "Up to 70% OFF",
    subtitle: "Top deals across every category, refreshed daily.",
    cta: "Shop top deals",
    href: "/offers?type=top_deals&title=Top%20Deals",
    icon: Percent,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=80",
    gradient: "from-stitch-primary via-stitch-secondary to-emerald-500",
  },
  {
    eyebrow: "Just Landed",
    title: "New Arrivals Daily",
    subtitle: "Be the first to grab the freshest offers near you.",
    cta: "Explore new",
    href: "/offers?type=new_arrivals&title=New%20Arrivals",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=80",
    gradient: "from-emerald-700 via-teal-600 to-cyan-600",
  },
  {
    eyebrow: "Local Favourites",
    title: "Discover Vendors",
    subtitle: "Support trusted businesses around your neighbourhood.",
    cta: "Browse vendors",
    href: "/vendors",
    icon: Store,
    image:
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1100&q=80",
    gradient: "from-teal-800 via-stitch-secondary to-green-500",
  },
];

/** Smaller promo cards shown alongside the main carousel. */
const SIDE_CARDS: Slide[] = [
  {
    eyebrow: "Limited time",
    title: "Flash Coupons",
    subtitle: "Stackable savings, gone in hours.",
    cta: "Grab now",
    href: "/coupons",
    icon: Tag,
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=700&q=80",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    eyebrow: "Members only",
    title: "Refer & Earn",
    subtitle: "Invite friends, unlock rewards.",
    cta: "Learn more",
    href: "/offers?title=Rewards",
    icon: Gift,
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=700&q=80",
    gradient: "from-fuchsia-600 to-purple-700",
  },
];

/** Photo + brand gradient overlay stack, shared by every card. */
function Backdrop({ image, gradient }: { image: string; gradient: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Brand gradient blended onto the photo keeps text legible + on-theme */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 mix-blend-multiply", gradient)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
    </>
  );
}

/** Decorative translucent blobs that give the cards depth. */
function Decor() {
  return (
    <>
      <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-md" />
      <span className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-black/10 blur-md" />
    </>
  );
}

function SideCard({ slide }: { slide: Slide }) {
  const Icon = slide.icon;
  return (
    <Link
      href={slide.href}
      className="group relative flex min-h-[140px] flex-1 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Backdrop image={slide.image} gradient={slide.gradient} />
      <Decor />
      <div className="relative z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm">
          {slide.eyebrow}
        </span>
        <h3 className="mt-2 text-[17px] font-bold leading-tight drop-shadow-sm">{slide.title}</h3>
        <p className="mt-0.5 text-[12px] text-white/90">{slide.subtitle}</p>
      </div>
      <div className="relative z-10 mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[12px] font-semibold">
          {slide.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
        <Icon className="h-7 w-7 text-white/50" />
      </div>
    </Link>
  );
}

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const count = SLIDES.length;

  const go = useCallback(
    (dir: number) => setActive((prev) => (prev + dir + count) % count),
    [count]
  );

  // Auto-rotate every 5s; pauses are not required for this lightweight banner.
  useEffect(() => {
    const id = setInterval(() => setActive((prev) => (prev + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="mx-auto max-w-container-max px-4 pt-5">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* ── Main rotating banner ── */}
        <div className="relative overflow-hidden rounded-3xl lg:col-span-2">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {SLIDES.map((slide) => {
              const Icon = slide.icon;
              return (
                <div key={slide.title} className="w-full shrink-0">
                  <Link
                    href={slide.href}
                    className="relative flex min-h-[210px] flex-col justify-center overflow-hidden p-6 text-white sm:min-h-[250px] sm:p-9 lg:min-h-[316px]"
                  >
                    <Backdrop image={slide.image} gradient={slide.gradient} />
                    <Decor />
                    <Icon className="pointer-events-none absolute -right-4 bottom-2 z-[1] h-40 w-40 text-white/15 sm:h-52 sm:w-52" />
                    <div className="relative z-10 max-w-md">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm">
                        <Sparkles className="h-3 w-3" />
                        {slide.eyebrow}
                      </span>
                      <h2 className="mt-3 text-3xl font-extrabold leading-tight drop-shadow-sm sm:text-[40px]">
                        {slide.title}
                      </h2>
                      <p className="mt-1.5 text-[13px] text-white/90 drop-shadow-sm sm:text-[15px]">
                        {slide.subtitle}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-stitch-primary shadow-sm transition-transform hover:scale-[1.02]">
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition hover:bg-white/50 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition hover:bg-white/50 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.title}
                onClick={() => setActive(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all duration-300",
                  i === active ? "w-5 opacity-100" : "w-1.5 opacity-50"
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Side promo cards ── */}
        <div className="flex gap-4 lg:flex-col">
          {SIDE_CARDS.map((card) => (
            <SideCard key={card.title} slide={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
