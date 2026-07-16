# Cliché Marketing Digital — Sistema de Captación de Prospectos NFC

Sistema inteligente de captación de prospectos activado por tarjeta NFC. Permite registrar clientes potenciales, enviar catálogos automáticamente y alimentar una base de datos escalable.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| Validaciones | Zod + React Hook Form |
| Base de datos | Supabase (PostgreSQL) |
| Email | Resend |
| Despliegue | Vercel |

---

## Arquitectura del sistema

```
NFC Card → Web App → Form → API Route → Supabase DB
                                      ↓
                                 Resend Email (PDF)
                                      ↓
                              WhatsApp Deep Link (hoy)
                              WhatsApp Meta API (futuro)
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   └── prospects/route.ts     # API: recibe y guarda el lead
│   ├── aviso-de-privacidad/
│   │   └── page.tsx               # Página de aviso de privacidad
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Página principal con formulario
├── components/
│   ├── ui/
│   │   ├── AnimatedBackground.tsx
│   │   └── Logo.tsx
│   ├── LeadForm.tsx               # Formulario principal
│   └── SuccessScreen.tsx          # Pantalla de éxito
├── lib/
│   ├── email.ts                   # Envío de correos con Resend
│   ├── supabase.ts                # Clientes Supabase (público y admin)
│   ├── utils.ts                   # Utilidades: cn, hashIp, etc.
│   ├── validations.ts             # Esquemas Zod
│   └── whatsapp.ts                # WhatsApp: deep-link / Meta API
└── types/
    └── prospect.ts                # Tipos TypeScript del dominio
supabase/
└── migrations/
    └── 001_create_prospects.sql   # Migración de base de datos
```

---

## Setup inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales reales (ver sección Variables de entorno).

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migrations/001_create_prospects.sql`
3. Copia las claves desde **Settings → API** a tu `.env.local`

### 4. Configurar Resend

1. Crea una cuenta en [resend.com](https://resend.com)
2. Agrega y verifica tu dominio
3. Genera una API Key y ponla en `RESEND_API_KEY`
4. Sube tu PDF del catálogo y pon la URL en `CATALOG_PDF_URL`

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role (solo servidor) | ✅ |
| `RESEND_API_KEY` | API key de Resend | ✅ |
| `RESEND_FROM_EMAIL` | Email remitente verificado | ✅ |
| `CATALOG_PDF_URL` | URL pública del PDF del catálogo | ✅ |
| `API_SECRET` | String aleatorio para firmar hashes | ✅ |
| `WHATSAPP_API_URL` | URL de la Meta Cloud API | ⏳ Futuro |
| `WHATSAPP_API_TOKEN` | Token de la Meta API | ⏳ Futuro |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID de Meta | ⏳ Futuro |

---

## Despliegue en Vercel

```bash
# Instala el CLI de Vercel si no lo tienes
npm i -g vercel

# Despliega
vercel --prod
```

En el dashboard de Vercel, agrega todas las variables de entorno de `.env.local.example`.

**Configuración recomendada:**
- Framework: Next.js
- Node.js: 20.x
- Region: US East (más cercana a México)

---

## Activar WhatsApp Meta API (cuando sea aprobado)

Cuando Meta apruebe tu cuenta de negocio:

1. Agrega las 4 variables en `.env.local` y en Vercel:
   - `WHATSAPP_API_URL`
   - `WHATSAPP_API_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_TEMPLATE_NAME`

2. Agrega la variable:
   ```
   WHATSAPP_MODE=META_API
   ```

3. Crea un template de mensaje en Meta Business Suite llamado `catalog_send` con los parámetros:
   - `{{1}}` = Nombre del cliente
   - `{{2}}` = Nombre del negocio
   - `{{3}}` = URL del catálogo

**Sin tocar una sola línea de código del formulario ni del API route.**

---

## Modelo de datos — tabla `prospects`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador único |
| `name` | text | Nombre del prospecto |
| `business` | text | Nombre del negocio |
| `whatsapp` | text | Número de WhatsApp |
| `email` | text | Correo electrónico (único) |
| `consent` | boolean | Consentimiento ARCO |
| `status` | enum | new / contacted / qualified / ... |
| `origin` | enum | nfc / qr / web / referral / ... |
| `catalog_sent` | boolean | Si se envió el correo |
| `catalog_sent_at` | timestamptz | Cuándo se envió |
| `whatsapp_sent` | boolean | Si se envió por WA |
| `ip_hash` | text | Hash del IP (privacidad) |
| `utm_source/medium/campaign` | text | Atribución de marketing |
| `created_at` | timestamptz | Fecha de registro |

---

## Integraciones futuras sugeridas

| Plataforma | Caso de uso |
|---|---|
| **Make / Zapier** | Webhook al crear lead → notificar en Slack, crear contacto en CRM |
| **HubSpot / Pipedrive** | Sincronizar prospectos automáticamente |
| **Mailchimp / Brevo** | Agregar a listas de email marketing |
| **Google Analytics 4** | Evento `lead_captured` al enviar el form |
| **Meta Pixel** | Remarketing a visitantes que no convirtieron |
| **Resend Broadcasts** | Campañas de email segmentadas desde la BD |

Para cualquiera de estas, el endpoint `/api/prospects` puede emitir un webhook a `WEBHOOK_URL` en el futuro sin cambiar nada más.

---

## Seguridad implementada

- ✅ Honeypot anti-bot en el formulario
- ✅ Rate limiting por IP (3 req/min)
- ✅ Validación con Zod en cliente y servidor
- ✅ Sanitización de inputs (strip HTML)
- ✅ IP almacenada solo como hash SHA-256
- ✅ Service role key solo en servidor (nunca expuesta al cliente)
- ✅ Headers de seguridad HTTP (X-Frame-Options, etc.)
- ✅ RLS en Supabase (anon solo puede insertar con consent=true)
- ✅ `robots: noindex` (no indexar el formulario en buscadores)

---

© 2025 Cliché Marketing Digital
