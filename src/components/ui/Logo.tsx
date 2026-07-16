"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { outer: "w-8 h-8", inner: "text-xs", name: "text-sm", sub: "text-[9px]" },
    md: { outer: "w-12 h-12", inner: "text-base", name: "text-xl", sub: "text-[10px]" },
    lg: { outer: "w-16 h-16", inner: "text-xl", name: "text-2xl", sub: "text-xs" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Monogram icon */}
      <div className="relative">
        <div
          className={cn(
            "rounded-2xl flex items-center justify-center",
            s.outer
          )}
          style={{
            background: "linear-gradient(135deg, #c026d3 0%, #6366f1 100%)",
            boxShadow: "0 8px 24px rgba(192,38,211,0.35)",
          }}
        >
          <span
            className={cn("font-bold text-white tracking-tight", s.inner)}
          >
            CM
          </span>
        </div>
        {/* Glow dot */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080810]" />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={cn("font-bold tracking-tight text-white", s.name)}
          style={{
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          Cliché
        </span>
        <span
          className={cn(
            "font-medium tracking-[0.15em] uppercase text-white/50",
            s.sub
          )}
        >
          Marketing Digital
        </span>
      </div>
    </div>
  );
}
