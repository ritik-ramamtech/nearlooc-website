import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary: "border-transparent bg-secondary/20 text-secondary hover:bg-secondary/30",
        destructive: "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "border-border text-foreground",
        success: "border-transparent bg-emerald-500/20 text-emerald-400",
        warning: "border-transparent bg-amber-500/20 text-amber-400",
        accent: "border-transparent bg-cyan-500/20 text-cyan-400",
        new: "border-transparent bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border border-indigo-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
