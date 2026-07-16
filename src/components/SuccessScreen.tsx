"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, X } from "lucide-react";

interface SuccessScreenProps {
  name: string;
  whatsappLink?: string;
}

export function SuccessScreen({ name }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center text-center gap-6 py-4"
    >
      {/* Success icon with animated ring */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(16,185,129,0.1) 100%)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <CheckCircle2 size={40} className="text-emerald-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Animated pulse rings */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-emerald-500/20"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
            transition={{
              delay: 0.3 + i * 0.2,
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-xl font-semibold text-white">
          ¡Listo, {name}! 🎉
        </h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
          Hemos recibido tu información correctamente. Te enviaremos el catálogo de servicios en breve.
        </p>
      </motion.div>

      {/* Delivery status cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full flex flex-col gap-2.5"
      >
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
            <Mail size={15} className="text-indigo-400" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white/75">Correo electrónico</p>
            <p className="text-[11px] text-white/35">El catálogo va en camino a tu bandeja</p>
          </div>
          <div className="ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

      </motion.div>

      {/* Close hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-1.5 text-white/50"
      >
        <X size={13} />
        <span className="text-xs">Puedes cerrar esta ventana</span>
      </motion.div>
    </motion.div>
  );
}
