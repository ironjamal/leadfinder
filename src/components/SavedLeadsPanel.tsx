"use client";

import { useMemo, useState } from "react";
import { LEAD_STATUS_LABELS, LEAD_STATUSES, LeadStatus, SavedLead } from "@/lib/types";
import { downloadCsv, leadsToCsv } from "@/lib/csv";
import { buildTelUrl, buildWhatsAppUrl } from "@/lib/phone";
import StatusBadge from "./StatusBadge";

interface Props {
  leads: SavedLead[];
  onRemove: (placeId: string) => void;
  onClearAll: () => void;
  onUpdateStatus: (placeId: string, status: LeadStatus) => void;
  onUpdateNotes: (placeId: string, notes: string) => void;
  onClose: () => void;
}

type StatusFilter = "all" | LeadStatus;

export default function SavedLeadsPanel({
  leads,
  onRemove,
  onClearAll,
  onUpdateStatus,
  onUpdateNotes,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmingClear, setConfirmingClear] = useState(false);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.leadStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.category.toLowerCase().includes(q) ||
        lead.address.toLowerCase().includes(q) ||
        (lead.phone || "").toLowerCase().includes(q)
      );
    });
  }, [leads, query, statusFilter]);

  const allFilteredSelected =
    filteredLeads.length > 0 && filteredLeads.every((lead) => selectedIds.has(lead.placeId));

  function toggleSelected(placeId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredLeads.forEach((lead) => next.delete(lead.placeId));
      } else {
        filteredLeads.forEach((lead) => next.add(lead.placeId));
      }
      return next;
    });
  }

  function handleExportAll() {
    downloadCsv("lead-finder-all-leads.csv", leadsToCsv(leads));
  }

  function handleExportSelected() {
    const selected = leads.filter((lead) => selectedIds.has(lead.placeId));
    downloadCsv("lead-finder-selected-leads.csv", leadsToCsv(selected));
  }

  function handleClearAll() {
    onClearAll();
    setSelectedIds(new Set());
    setConfirmingClear(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-4xl rounded-xl border border-fg/10 bg-bg p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Saved Leads ({leads.length})</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-fg/20 px-3 py-1.5 text-sm hover:border-fg/40"
          >
            Close
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, location, or phone"
            className="w-full rounded-lg border border-fg/15 bg-white/[0.02] px-3 py-2 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent sm:max-w-xs"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-fg/15 bg-white/[0.02] px-3 py-2 text-sm text-fg outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
              disabled={filteredLeads.length === 0}
            />
            Select all shown ({selectedIds.size} selected)
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportSelected}
              disabled={selectedIds.size === 0}
              className="rounded-lg border border-fg/20 px-3 py-1.5 text-sm text-fg hover:border-fg/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Selected
            </button>
            <button
              onClick={handleExportAll}
              disabled={leads.length === 0}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-fg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export All CSV
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <p className="rounded-lg border border-fg/10 bg-white/[0.02] p-6 text-center text-sm text-muted">
            No leads saved yet. Save businesses from your search results to build your list.
          </p>
        ) : filteredLeads.length === 0 ? (
          <p className="rounded-lg border border-fg/10 bg-white/[0.02] p-6 text-center text-sm text-muted">
            {query
              ? "No saved leads match your search."
              : "No leads in this status yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLeads.map((lead) => (
              <SavedLeadRow
                key={lead.placeId}
                lead={lead}
                isSelected={selectedIds.has(lead.placeId)}
                onToggleSelected={() => toggleSelected(lead.placeId)}
                onRemove={() => onRemove(lead.placeId)}
                onUpdateStatus={(status) => onUpdateStatus(lead.placeId, status)}
                onUpdateNotes={(notes) => onUpdateNotes(lead.placeId, notes)}
              />
            ))}
          </div>
        )}

        {leads.length > 0 && (
          <div className="mt-6 border-t border-fg/10 pt-4">
            {!confirmingClear ? (
              <button
                onClick={() => setConfirmingClear(true)}
                className="text-sm text-muted hover:text-accent"
              >
                Clear all saved leads
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
                <span>Delete all {leads.length} saved leads? This cannot be undone.</span>
                <button
                  onClick={handleClearAll}
                  className="rounded-lg bg-accent px-3 py-1.5 font-medium text-fg hover:opacity-90"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setConfirmingClear(false)}
                  className="rounded-lg border border-fg/20 px-3 py-1.5 text-fg hover:border-fg/40"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface RowProps {
  lead: SavedLead;
  isSelected: boolean;
  onToggleSelected: () => void;
  onRemove: () => void;
  onUpdateStatus: (status: LeadStatus) => void;
  onUpdateNotes: (notes: string) => void;
}

function SavedLeadRow({
  lead,
  isSelected,
  onToggleSelected,
  onRemove,
  onUpdateStatus,
  onUpdateNotes,
}: RowProps) {
  const [noteDraft, setNoteDraft] = useState(lead.notes);

  function commitNotes() {
    if (noteDraft !== lead.notes) onUpdateNotes(noteDraft);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-fg/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={isSelected} onChange={onToggleSelected} className="mt-1" />
          <div>
            <p className="font-medium text-fg">{lead.name}</p>
            <p className="text-sm text-muted">{lead.category}</p>
            <p className="text-sm text-muted">{lead.address}</p>
            <p className="text-sm text-muted">{lead.phone || "Phone unavailable"}</p>
          </div>
        </div>
        <StatusBadge status={lead.websiteStatus} />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline underline-offset-2 hover:text-accent"
          >
            Website
          </a>
        )}
        <a
          href={lead.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline underline-offset-2 hover:text-accent"
        >
          Maps
        </a>
        {lead.phone && (
          <a href={buildTelUrl(lead.phone)} className="text-fg underline underline-offset-2 hover:text-accent">
            Call
          </a>
        )}
        {lead.phoneWhatsApp && (
          <a
            href={buildWhatsAppUrl(lead.phoneWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline underline-offset-2 hover:text-accent"
          >
            WhatsApp
          </a>
        )}
        <span className="text-muted">
          {lead.rating !== null ? `★ ${lead.rating.toFixed(1)}` : "No rating"}
          {lead.reviewCount !== null ? ` (${lead.reviewCount})` : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={lead.leadStatus}
          onChange={(e) => onUpdateStatus(e.target.value as LeadStatus)}
          className="rounded-lg border border-fg/15 bg-bg px-2 py-1 text-sm text-fg outline-none focus:border-accent"
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <button onClick={onRemove} className="text-sm text-muted hover:text-accent">
          Delete
        </button>
      </div>

      <textarea
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={commitNotes}
        placeholder="Add a short note..."
        rows={2}
        className="w-full resize-none rounded-lg border border-fg/15 bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted/70 outline-none focus:border-accent"
      />
    </div>
  );
}
