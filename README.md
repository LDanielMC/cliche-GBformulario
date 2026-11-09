# Cliché GB Formulario — captación de prospectos por tarjeta NFC

Aplicación web que recibe a quien toca con su teléfono una tarjeta NFC de Cliché Marketing Digital: le pide sus datos en un formulario, los guarda en Firebase Firestore y le envía por correo el catálogo de servicios. Sirve al equipo comercial de la agencia para convertir cada contacto en persona en un prospecto registrado. **En producción.**

## Funcionalidades principales

- **Formulario de captura** con nombre, negocio, WhatsApp, correo y casilla de consentimiento, validado en el navegador y de nuevo en el servidor con Zod. El número de WhatsApp se valida con formato mexicano.
- **Registro en Firestore** (colección `prospectos_nfc`) con origen `nfc`, estatus, parámetros UTM, fecha, y un hash de la IP en lugar de la IP.
- **Envío automático del catálogo** por correo con Resend, con el PDF como enlace o adjunto, y registro de si se envió.
- **Antiduplicados:** rechaza un correo ya registrado y un negocio repetido (identificador de documento a partir del negocio y los últimos cuatro dígitos del WhatsApp).
- **Protección básica:** límite de 3 solicitudes por minuto y por IP, sanitización de texto y cabeceras de seguridad HTTP.
- **Aviso de privacidad** en una página propia.
- **Animaciones** y pantalla de confirmación al terminar el registro.

## Capturas

<!-- Agrega aquí tus imágenes, por ejemplo: ![Formulario](docs/capturas/formulario.png) -->

_Pendiente._

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript 5 |
| Estilos y animación | Tailwind CSS 3, Radix UI, Framer Motion 11 |
| Formularios y validación | React Hook Form 7, Zod 3 |
| Base de datos | Firebase Firestore (SDK de administrador `firebase-admin` 14) |
| Correo | Resend 3 |

## Arquitectura

```
Tarjeta NFC → página con el formulario → POST /api/prospects → Firestore (prospectos_nfc)
                                                            └→ correo con el catálogo (Resend)
```

```
src/
├── app/
│   ├── api/prospects/route.ts   recibe, valida, deduplica y guarda el prospecto; dispara el correo
│   ├── aviso-de-privacidad/     página del aviso de privacidad
│   ├── layout.tsx
│   └── page.tsx                 página con el formulario
├── components/                  LeadForm, SuccessScreen y elementos de interfaz
├── lib/
│   ├── firebase.ts              inicializa Firestore con una cuenta de servicio
│   ├── email.ts                 correo del catálogo con Resend
│   ├── validations.ts           esquemas Zod
│   ├── utils.ts                 sanitización, hash de IP, IP del cliente
│   └── whatsapp.ts              módulo de WhatsApp (enlace directo o API de Meta); aún no se invoca desde la API
└── types/prospect.ts
supabase/migrations/             migración de Supabase heredada; el proyecto no usa Supabase
```

La persistencia es solo Firestore. La carpeta `supabase/` quedó de una versión anterior del proyecto y no se ejecuta en ningún punto del código.

## Instalación y ejecución

Requisitos: Node.js 18.17 o superior, un proyecto de Firebase con Firestore y una cuenta de Resend con un dominio verificado.

```bash
git clone https://github.com/LDanielMC/cliche-GBformulario.git
cd cliche-GBformulario
npm install
# crea .env.local con las variables de la tabla siguiente
npm run dev          # http://localhost:3000
```

### Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | JSON de la cuenta de servicio de Firebase, codificado en base64 | Sí |
| `RESEND_API_KEY` | Clave de la API de Resend | Sí |
| `RESEND_FROM_EMAIL` | Remitente verificado en Resend | Sí |
| `RESEND_FROM_NAME` | Nombre del remitente (por defecto "Cliché Marketing Digital") | No |
| `CATALOG_PDF_URL` | URL pública del PDF del catálogo | Sí |
| `API_SECRET` | Cadena aleatoria con la que se calcula el hash de la IP | Sí |
| `WHATSAPP_MODE`, `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE_NAME` | Para activar la API de WhatsApp de Meta cuando esté aprobada (por defecto, enlace directo) | No |

Para generar el valor de la cuenta de servicio: `base64 -w0 serviceAccount.json` (en macOS, `base64 -i serviceAccount.json`).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Ejecuta la compilación |
| `npm run lint` | Revisa el código con ESLint |
| `npm run type-check` | Revisa los tipos con TypeScript |

## Pruebas

El proyecto no incluye pruebas automatizadas; la calidad del código se revisa con `npm run lint` y `npm run type-check`.
