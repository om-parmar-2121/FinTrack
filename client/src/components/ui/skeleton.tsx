import type { FC, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-800/60", className)}
      {...props}
    />
  );
};

export default Skeleton;
