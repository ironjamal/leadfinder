export type WebsiteStatus = "listed" | "none" | "unknown";

export type LeadStatus =
  | "new"
  | "contacted"
  | "replied"
  | "interested"
  | "won"
  | "not_interested";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "replied",
  "interested",
  "won",
  "not_interested",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  replied: "Replied",
  interested: "Interested",
  won: "Won",
  not_interested: "Not Interested",
};

export interface Business {
  placeId: string;
  name: string;
  category: string;
  address: string;
  /** Display-friendly phone number (national format preferred). */
  phone: string | null;
  /**
   * Digits-only phone number (with country code, no "+"), safe to use in a
   * wa.me WhatsApp link. Derived from Google's internationalPhoneNumber,
   * which already includes the correct country code for the place — this
   * avoids guessing at local-format numbers ourselves. Null when Google
   * didn't return an international number or it looks unreliable.
   */
  phoneWhatsApp: string | null;
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  websiteStatus: WebsiteStatus;
  googleMapsUrl: string;
}

/** A business the user has saved, with lightweight CRM fields attached. */
export interface SavedLead extends Business {
  leadStatus: LeadStatus;
  notes: string;
  savedAt: string; // ISO timestamp
}

export interface SearchRequestBody {
  businessType: string;
  location: string;
  resultCount: 20 | 50 | 100;
}

export interface SearchResponseBody {
  results: Business[];
  requestedCount: number;
  warning?: string;
}

export interface ApiErrorBody {
  error: string;
}
