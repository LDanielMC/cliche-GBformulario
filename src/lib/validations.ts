import { z } from "zod";

const mexicanPhoneRegex = /^(\+52|52)?[\s\-]?(\d{2,3})[\s\-]?(\d{3,4})[\s\-]?(\d{4})$/;

export const prospectSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo.")
    .trim(),
  business: z
    .string()
    .min(2, "El nombre del negocio debe tener al menos 2 caracteres.")
    .max(150, "El nombre del negocio es demasiado largo.")
    .trim(),
  whatsapp: z
    .string()
    .regex(
      mexicanPhoneRegex,
      "Ingresa un número de WhatsApp válido (ej: 614 123 4567)."
    )
    .transform((val) => val.replace(/[\s\-]/g, "")),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido.")
    .max(200, "El correo es demasiado largo.")
    .toLowerCase()
    .trim(),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Debes aceptar el Aviso de Privacidad para continuar.",
    }),
  }),
  honeypot: z.string().max(0, "Bot detected.").optional(),
});

export type ProspectSchemaType = z.infer<typeof prospectSchema>;

export const apiProspectSchema = prospectSchema.omit({ honeypot: true });
