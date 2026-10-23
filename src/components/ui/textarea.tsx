import { cn } from "@/lib/utils";
import { campoBase } from "./input";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(campoBase, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}
