import type { FC, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Badge: FC<HTMLAttributes<HTMLSpanElement> & { variant?: string }> = ({ children, className = "", variant, ...props }) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const variants: Record<string, string> = {
    default: "bg-muted text-foreground",
    secondary: "bg-white text-black",
  };

  return (
    <span className={cn(base, variants[variant ?? "default"], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;