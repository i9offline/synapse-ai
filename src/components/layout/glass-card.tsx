"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "subtle" | "strong";
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "glass",
    subtle: "glass-subtle",
    strong: "glass-strong",
  };

  return (
    <motion.div
      className={cn(variants[variant], hover && "glass-hover", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
