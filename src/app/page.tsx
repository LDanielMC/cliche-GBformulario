"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Logo } from "@/components/ui/Logo";
import { LeadForm } from "@/components/LeadForm";

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] flex flex-col gap-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-5"
          >
            <Logo size="lg" />

            {/* Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-purple-300/80"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.15)",
              }}
            >
              <Sparkles size={11} className="text-purple-400" />
              Acceso exclusivo · Tarjeta digital
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Card top glow line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)",
              }}
            />

            <div className="px-6 pt-7 pb-8 flex flex-col gap-6">
              {/* Copy */}
              <div className="text-center flex flex-col gap-2">
                <h1 className="text-[22px] font-bold text-white leading-tight tracking-tight">
                  Recibe nuestro{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #c084fc, #818cf8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    catálogo de servicios
                  </span>
                </h1>
                <p className="text-sm text-white/40 leading-relaxed">
                  Completa tus datos y te enviamos toda la información.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

              {/* Form */}
              <Suspense>
                <LeadForm />
              </Suspense>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center text-[11px] text-white/20"
          >
            © {new Date().getFullYear()} Cliché Marketing Digital
          </motion.p>
        </div>
      </main>
    </>
  );
}
