import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { sendCatalogEmail } from "@/lib/email";
import { apiProspectSchema } from "@/lib/validations";
import { sanitize, hashIp, getClientIp, slugify } from "@/lib/utils";
import type { ApiResponse } from "@/types/prospect";

/** Simple in-memory rate limiter (per IP, per process). */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);

    if (isRateLimited(ip)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Solicitud inválida." },
        { status: 400 }
      );
    }

    const parsed = apiProspectSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Datos inválidos.", data: errors },
        { status: 422 }
      );
    }

    const { name, business, whatsapp, email, consent } = parsed.data;

    // Check for duplicate email
    const existing = await db
      .collection("prospectos_nfc")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Este correo ya está registrado." },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const lastFour = whatsapp.slice(-4);
    const docId = `${slugify(business)}-${lastFour}`;
    const docRef = db.collection("prospectos_nfc").doc(docId);

    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Este negocio ya está registrado." },
        { status: 409 }
      );
    }

    await docRef.set({
      name: sanitize(name),
      business: sanitize(business),
      whatsapp,
      email,
      consent,
      origin: "nfc",
      status: "new",
      ip_hash: hashIp(ip),
      user_agent: req.headers.get("user-agent")?.slice(0, 255) ?? null,
      utm_source: (body.utm_source as string | null) ?? null,
      utm_medium: (body.utm_medium as string | null) ?? null,
      utm_campaign: (body.utm_campaign as string | null) ?? null,
      catalog_sent: false,
      catalog_sent_at: null,
      notes: null,
      created_at: now,
      updated_at: now,
    });

    const emailResult = await sendCatalogEmail({ name, email, business });
    const catalogSent = emailResult.success;
    const sentNow = new Date().toISOString();

    await docRef.update({
      catalog_sent: catalogSent,
      catalog_sent_at: catalogSent ? sentNow : null,
      status: "contacted",
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Registro completado.",
        data: { id: docRef.id, catalogSent },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[prospects] Unhandled error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
