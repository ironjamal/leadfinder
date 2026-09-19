/** Builds a tel: link from a display phone number. */
export function buildTelUrl(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

/**
 * Builds a wa.me link from digits-only, country-code-prefixed digits.
 * Only call this with a value that has already been validated (see
 * Business.phoneWhatsApp) — this function does not itself guess a country
 * code, since that's unreliable for local-format Gulf/Egypt numbers.
 */
export function buildWhatsAppUrl(phoneWhatsAppDigits: string): string {
  return `https://wa.me/${phoneWhatsAppDigits}`;
}
