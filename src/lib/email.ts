import { Resend } from "resend";
import type { Prospect } from "@/types/prospect";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.RESEND_FROM_NAME ?? "Cliché Marketing Digital"} <${
  process.env.RESEND_FROM_EMAIL ?? "noreply@clichemarketingdigital.com"
}>`;

const CATALOG_URL = process.env.CATALOG_PDF_URL ?? "";

/**
 * Sends the catalog PDF to the prospect via email.
 * Returns true on success, false on failure.
 */
export async function sendCatalogEmail(
  prospect: Pick<Prospect, "name" | "email" | "business">
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: prospect.email,
      subject: "Tu catálogo de servicios — Cliché Marketing Digital",
      html: buildEmailHtml(prospect),
      attachments: CATALOG_URL
        ? [
            {
              filename: "Catalogo-Cliche-Marketing-Digital.pdf",
              path: CATALOG_URL,
            },
          ]
        : [],
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] Unexpected error:", message);
    return { success: false, error: message };
  }
}

function buildEmailHtml(
  prospect: Pick<Prospect, "name" | "email" | "business">
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu catálogo de servicios</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#12101a 0%,#1a1025 100%);border-radius:16px;border:1px solid rgba(217,70,239,0.2);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;text-align:center;background:linear-gradient(135deg,rgba(217,70,239,0.08) 0%,rgba(99,102,241,0.08) 100%);">
              <img src="https://formulario.cliche.com.mx/logocliche.png" alt="Cliché Marketing Digital" style="height:60px;width:auto;display:block;margin:0 auto;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 48px 40px;">
              <p style="color:#e5e7eb;font-size:18px;font-weight:600;margin:0 0 12px;">Hola, ${prospect.name} 👋</p>
              <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Gracias por tu interés en <strong style="color:#d946ef;">${prospect.business}</strong>. Adjunto encontrarás nuestro catálogo completo de servicios con toda la información que conversamos.
              </p>
              <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 32px;">
                Si tienes dudas o quieres agendar una reunión, responde este correo. Estamos listos para ayudarte a llevar tu negocio al siguiente nivel.
              </p>
              <!-- CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                ${
                  CATALOG_URL
                    ? `<a href="${CATALOG_URL}" style="display:inline-block;background:linear-gradient(135deg,#d946ef,#818cf8);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.3px;">Ver catálogo online</a>`
                    : ""
                }
              </div>
              <!-- Divider -->
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
                Este mensaje fue enviado a <a href="mailto:${prospect.email}" style="color:#d946ef;">${prospect.email}</a> porque registraste tus datos en nuestra tarjeta digital y aceptaste recibir información comercial. Puedes solicitar tu baja en cualquier momento respondiendo este correo.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 48px;background:rgba(0,0,0,0.3);text-align:center;">
              <p style="color:#4b5563;font-size:12px;margin:0;">© ${new Date().getFullYear()} Cliché Marketing Digital · Todos los derechos reservados</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
