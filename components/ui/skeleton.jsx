import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-[#979799]", className)}
      {...props} />)
  );
}

export { Skeleton }
