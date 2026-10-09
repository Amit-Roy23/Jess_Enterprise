/** Jess Enterprises contact details — single source of truth for the public site. */
export const CONTACT = {
  email: "jess.enterprises14@gmail.com",
  office: "9225901519",
  mobile: "9158391519",
  /** WhatsApp chats go to the office number, in international format without "+". */
  whatsapp: "919225901519",
  address: "Goa, India",
} as const;

export function whatsappLink(message: string, number: string = CONTACT.whatsapp): string {
  const digits = number.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
