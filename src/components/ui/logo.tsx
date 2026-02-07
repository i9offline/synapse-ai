import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 20 }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="SynapseAI"
      width={size}
      height={size}
      className={cn("block", className)}
    />
  );
}
