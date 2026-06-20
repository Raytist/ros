import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-light)] text-[var(--primary)]",
        secondary: "bg-[var(--background)] text-[var(--muted)]",
        success: "bg-green-50 text-[var(--success)]",
        warning: "bg-amber-50 text-amber-800",
        danger: "bg-red-50 text-[var(--danger)]",
        expert: "bg-amber-50 text-amber-900",
        basic: "bg-[var(--primary-light)] text-[var(--primary)]",
        intern: "bg-[var(--background)] text-[var(--muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
