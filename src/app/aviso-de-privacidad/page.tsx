import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — Cliché Marketing Digital",
  robots: "noindex",
};

export default function PrivacyPage() {
  const updated = "15 de julio de 2025";

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Logo size="sm" />
            </Link>
            <div
              className="rounded-2xl px-6 py-8 flex flex-col gap-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-white">Aviso de Privacidad</h1>
                <p className="text-sm text-white/35">Última actualización: {updated}</p>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="flex flex-col gap-5 text-sm text-white/55 leading-relaxed">
                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">1. Responsable del tratamiento</h2>
                  <p>
                    <strong className="text-white/70">Cliché Marketing Digital</strong> (en adelante "Cliché") es responsable del tratamiento de sus datos personales. Para cualquier consulta puede contactarnos en{" "}
                    <a href="mailto:contacto@cliche.com.mx" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                      contacto@cliche.com.mx
                    </a>.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">2. Datos que recopilamos</h2>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Nombre completo</li>
                    <li>Nombre del negocio o empresa</li>
                    <li>Número de WhatsApp</li>
                    <li>Correo electrónico</li>
                    <li>Fecha y hora del registro</li>
                    <li>Origen del contacto (tarjeta NFC, QR, etc.)</li>
                  </ul>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">3. Finalidades del tratamiento</h2>
                  <p>Sus datos serán utilizados para:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enviarle el catálogo de servicios solicitado.</li>
                    <li>Realizar seguimiento comercial y de ventas.</li>
                    <li>Enviarle información sobre nuestros servicios, promociones y novedades por correo electrónico y WhatsApp, siempre que haya otorgado su consentimiento.</li>
                    <li>Gestionar la relación comercial.</li>
                  </ul>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">4. Transferencia de datos</h2>
                  <p>
                    Sus datos personales no serán vendidos ni cedidos a terceros. Podrán ser compartidos únicamente con proveedores de servicios tecnológicos necesarios para el funcionamiento del sistema (almacenamiento, envío de correos), quienes están obligados a tratar sus datos con la misma confidencialidad.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">5. Conservación de datos</h2>
                  <p>
                    Sus datos se conservarán mientras la relación comercial esté activa o hasta que solicite su eliminación.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">6. Derechos ARCO</h2>
                  <p>
                    Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, escríbanos a{" "}
                    <a href="mailto:contacto@cliche.com.mx" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                      contacto@cliche.com.mx
                    </a>{" "}
                    indicando su nombre y la solicitud concreta.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-white/80">7. Cambios a este aviso</h2>
                  <p>
                    Nos reservamos el derecho de actualizar este aviso de privacidad en cualquier momento. La versión vigente siempre estará disponible en esta página.
                  </p>
                </section>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <Link
                href="/"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver al formulario
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
