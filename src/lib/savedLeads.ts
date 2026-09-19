import { Business, LeadStatus, SavedLead } from "./types";

const STORAGE_KEY = "lead-finder-saved-leads";

function readStorage(): SavedLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(leads: SavedLead[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function getSavedLeads(): SavedLead[] {
  return readStorage();
}

/** Saves a lead. Uses Google's placeId as the unique key — no duplicates. */
export function saveLead(business: Business): SavedLead[] {
  const current = readStorage();
  if (current.some((lead) => lead.placeId === business.placeId)) {
    return current;
  }
  const newLead: SavedLead = {
    ...business,
    leadStatus: "new",
    notes: "",
    savedAt: new Date().toISOString(),
  };
  const updated = [...current, newLead];
  writeStorage(updated);
  return updated;
}

export function removeLead(placeId: string): SavedLead[] {
  const updated = readStorage().filter((lead) => lead.placeId !== placeId);
  writeStorage(updated);
  return updated;
}

export function clearAllLeads(): SavedLead[] {
  writeStorage([]);
  return [];
}

export function updateLeadStatus(placeId: string, status: LeadStatus): SavedLead[] {
  const updated = readStorage().map((lead) =>
    lead.placeId === placeId ? { ...lead, leadStatus: status } : lead
  );
  writeStorage(updated);
  return updated;
}

export function updateLeadNotes(placeId: string, notes: string): SavedLead[] {
  const updated = readStorage().map((lead) =>
    lead.placeId === placeId ? { ...lead, notes } : lead
  );
  writeStorage(updated);
  return updated;
}
