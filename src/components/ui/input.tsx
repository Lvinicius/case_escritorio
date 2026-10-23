import { cn } from "@/lib/utils";

export const campoBase =
  "w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(campoBase, "h-9", className)} {...props} />;
}
