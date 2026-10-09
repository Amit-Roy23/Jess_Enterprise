import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Images Next.js should not proxy through its optimizer (Wikimedia rejects
 * server-side hotlinking); the browser loads them directly instead.
 */
export function skipOptimization(url?: string): boolean {
  return !!url && /(^https?:\/\/)?upload\.wikimedia\.org\//.test(url);
}
