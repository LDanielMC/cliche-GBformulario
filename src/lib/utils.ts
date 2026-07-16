import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHash } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * One-way hash for IP addresses — stores privacy-safe fingerprint.
 * Used for deduplication analytics without storing raw IPs.
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.API_SECRET ?? "")).digest("hex").slice(0, 16);
}

/**
 * Extracts the real client IP from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Sanitize a string for safe storage (strip HTML tags).
 */
export function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Converts a string to a URL-safe slug.
 * e.g. "Agencia Prueba!" → "agencia-prueba"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Formats a Mexican phone number for display.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^52/, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}
