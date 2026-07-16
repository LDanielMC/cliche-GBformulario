/**
 * Core domain types for the Cliché lead-capture system.
 * These types are shared between client, server and future integrations.
 */

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost"
  | "nurturing";

export type LeadOrigin = "nfc" | "qr" | "web" | "referral" | "social" | "other";

export interface Prospect {
  id: string;
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  consent: boolean;
  status: LeadStatus;
  origin: LeadOrigin;
  ip_hash: string | null;
  user_agent: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  catalog_sent: boolean;
  catalog_sent_at: string | null;
  whatsapp_sent: boolean;
  whatsapp_sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProspectPayload {
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  consent: boolean;
  origin?: LeadOrigin;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

export interface ProspectFormData {
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  consent: boolean;
  honeypot?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
