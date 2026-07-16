/**
 * WhatsApp Module
 *
 * Current mode: DEEP_LINK (no Meta API approval yet)
 * Future mode:  META_API  (flip WHATSAPP_MODE env var when approved)
 *
 * Architecture is designed so that switching to the official API
 * only requires filling in the 4 env vars and setting WHATSAPP_MODE=META_API.
 * Zero business logic changes needed.
 */

type WhatsAppMode = "DEEP_LINK" | "META_API";

const MODE: WhatsAppMode =
  (process.env.WHATSAPP_MODE as WhatsAppMode) ?? "DEEP_LINK";

interface WhatsAppPayload {
  to: string;
  name: string;
  business: string;
  catalogUrl?: string;
}

interface WhatsAppResult {
  success: boolean;
  mode: WhatsAppMode;
  deepLinkUrl?: string;
  messageId?: string;
  error?: string;
}

/**
 * Attempts to send a WhatsApp message.
 *
 * In DEEP_LINK mode: returns a wa.me URL for the user to tap manually.
 * In META_API mode: sends via the official Cloud API.
 */
export async function sendWhatsAppNotification(
  payload: WhatsAppPayload
): Promise<WhatsAppResult> {
  if (MODE === "META_API") {
    return sendViaMetaApi(payload);
  }
  return generateDeepLink(payload);
}

/** --- Deep Link (current) ------------------------------------------- */
function generateDeepLink(payload: WhatsAppPayload): WhatsAppResult {
  const number = normalizePhone(payload.to);
  const text = encodeURIComponent(
    `Hola ${payload.name}, gracias por registrarte. Aquí está el catálogo de servicios de Cliché Marketing Digital: ${payload.catalogUrl ?? process.env.CATALOG_PDF_URL ?? ""}`
  );
  const deepLinkUrl = `https://wa.me/${number}?text=${text}`;
  return { success: true, mode: "DEEP_LINK", deepLinkUrl };
}

/** --- Meta Cloud API (future) ---------------------------------------- */
async function sendViaMetaApi(
  payload: WhatsAppPayload
): Promise<WhatsAppResult> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME ?? "catalog_send";

  if (!apiUrl || !token || !phoneNumberId) {
    return {
      success: false,
      mode: "META_API",
      error: "WhatsApp API credentials not configured.",
    };
  }

  try {
    const response = await fetch(
      `${apiUrl}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: normalizePhone(payload.to),
          type: "template",
          template: {
            name: templateName,
            language: { code: "es_MX" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: payload.name },
                  { type: "text", text: payload.business },
                  {
                    type: "text",
                    text: payload.catalogUrl ?? process.env.CATALOG_PDF_URL ?? "",
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        mode: "META_API",
        error: json?.error?.message ?? "Meta API error",
      };
    }

    return {
      success: true,
      mode: "META_API",
      messageId: json?.messages?.[0]?.id,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, mode: "META_API", error: message };
  }
}

function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s\-\(\)]/g, "");
  if (!p.startsWith("+") && !p.startsWith("52")) {
    p = `52${p}`;
  }
  return p.replace(/^\+/, "");
}
