"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  MessageCircle,
  Mail,
  ArrowRight,
  Loader2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { prospectSchema, type ProspectSchemaType } from "@/lib/validations";
import type { ApiResponse } from "@/types/prospect";
import { SuccessScreen } from "@/components/SuccessScreen";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface InputFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  index: number;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

function InputField({ id, label, icon, error, index, inputProps }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor={id}
        className={cn(
          "text-xs font-medium tracking-wide transition-colors",
          focused ? "text-purple-400" : "text-white/50"
        )}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors",
            focused ? "text-purple-400" : "text-white/25",
            error && "text-red-400/70"
          )}
        >
          {icon}
        </div>
        <input
          id={id}
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          className={cn(
            "w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white transition-all duration-200",
            "bg-white/[0.05] border placeholder:text-white/20",
            "focus:outline-none focus:ring-0",
            focused
              ? "border-purple-500/60 bg-white/[0.07] shadow-[0_0_0_3px_rgba(168,85,247,0.12)]"
              : "border-white/[0.08] hover:border-white/[0.14]",
            error && "border-red-500/40 bg-red-500/[0.04]"
          )}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-400 mt-0.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type FormStep = "form" | "loading" | "success";

export function LeadForm() {
  const [step, setStep] = useState<FormStep>("form");
  const [whatsappLink, setWhatsappLink] = useState<string | undefined>();
  const [userName, setUserName] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProspectSchemaType>({
    resolver: zodResolver(prospectSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      business: "",
      whatsapp: "",
      email: "",
      consent: false,
      honeypot: "",
    },
  });

  const onSubmit = useCallback(async (data: ProspectSchemaType) => {
    if (data.honeypot) return;

    setStep("loading");
    setGeneralError(null);

    const utmParams = {
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
      utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
      utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
    };

    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...utmParams }),
      });

      const json: ApiResponse<{ whatsappDeepLink?: string }> = await res.json();

      if (!res.ok || !json.success) {
        setGeneralError(json.error ?? "Ocurrió un error. Inténtalo de nuevo.");
        setStep("form");
        return;
      }

      setUserName(data.name.split(" ")[0]);
      setWhatsappLink(json.data?.whatsappDeepLink);
      setStep("success");
    } catch {
      setGeneralError("No se pudo conectar. Verifica tu conexión e inténtalo de nuevo.");
      setStep("form");
    }
  }, []);

  if (step === "success") {
    return <SuccessScreen name={userName} whatsappLink={whatsappLink} />;
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "loading" ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-12"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                <div
                  className="w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-400 opacity-70"
                  style={{ animation: "spin 1.2s linear infinite reverse" }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium">Registrando tu información</p>
              <p className="text-white/35 text-xs mt-1">Preparando tu catálogo...</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Honeypot — hidden from humans, catches bots */}
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
              {...register("honeypot")}
            />

            <InputField
              id="name"
              label="Nombre completo"
              icon={<User size={15} />}
              error={errors.name?.message}
              index={0}
              inputProps={{
                placeholder: "Juan Pérez",
                autoComplete: "name",
                autoCapitalize: "words",
                ...register("name"),
              }}
            />

            <InputField
              id="business"
              label="Nombre de tu negocio"
              icon={<Building2 size={15} />}
              error={errors.business?.message}
              index={1}
              inputProps={{
                placeholder: "Mi Empresa S.A.",
                autoComplete: "organization",
                autoCapitalize: "words",
                ...register("business"),
              }}
            />

            <InputField
              id="whatsapp"
              label="WhatsApp"
              icon={<MessageCircle size={15} />}
              error={errors.whatsapp?.message}
              index={2}
              inputProps={{
                placeholder: "614 123 4567",
                type: "tel",
                autoComplete: "tel",
                inputMode: "tel",
                ...register("whatsapp"),
              }}
            />

            <InputField
              id="email"
              label="Correo electrónico"
              icon={<Mail size={15} />}
              error={errors.email?.message}
              index={3}
              inputProps={{
                placeholder: "juan@empresa.com",
                type: "email",
                autoComplete: "email",
                inputMode: "email",
                ...register("email"),
              }}
            />

            {/* Consent checkbox */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex gap-3 items-start pt-1"
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  id="consent"
                  type="checkbox"
                  className="peer sr-only"
                  {...register("consent")}
                />
                <label
                  htmlFor="consent"
                  className={cn(
                    "flex w-5 h-5 rounded-md border cursor-pointer transition-all duration-200",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0d0d18]",
                    "bg-white/[0.04] border-white/[0.12]",
                    "peer-checked:bg-purple-600 peer-checked:border-purple-500",
                    errors.consent && "border-red-500/50"
                  )}
                >
                  <svg
                    className="w-full h-full p-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>
              <label htmlFor="consent" className="cursor-pointer">
                <span className="text-xs text-white/45 leading-relaxed">
                  He leído el{" "}
                  <a
                    href="/aviso-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Aviso de Privacidad
                  </a>{" "}
                  y acepto recibir información, promociones y novedades mediante correo electrónico y WhatsApp.
                </span>
                {errors.consent && (
                  <p className="text-xs text-red-400 mt-1">{errors.consent.message}</p>
                )}
              </label>
            </motion.div>

            {/* General error */}
            <AnimatePresence>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400"
                >
                  {generalError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="pt-1"
            >
              <button
                type="submit"
                className={cn(
                  "w-full relative overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600",
                  "transition-all duration-200 active:scale-[0.98]",
                  "shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]",
                  "group flex items-center justify-center gap-2.5"
                )}
              >
                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s linear infinite",
                  }}
                />
                <span className="relative flex items-center gap-2.5">
                  Recibir información
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center gap-1.5 pt-1"
            >
              <Shield size={11} className="text-white/20" />
              <span className="text-[11px] text-white/25">
                Tus datos están protegidos · Sin spam
              </span>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
