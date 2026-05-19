import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── StatCard ─────────────────────────────────────────────────────────────────
// Reusable metric card. Used in profile overview, top items, etc.
// Accepts an icon, value, label, and optional trend/sublabel.

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  sublabel?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  iconColor = "text-primary",
  className,
  onClick,
}: StatCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl bg-muted transition-colors",
          onClick && "group-hover:bg-primary/10"
        )}
      >
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        {sublabel && (
          <p className="mt-1 text-xs text-muted-foreground/60">{sublabel}</p>
        )}
      </div>
    </Tag>
  );
}
