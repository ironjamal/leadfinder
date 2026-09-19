"use client";

import { useEffect, useMemo, useState } from "react";
import SearchForm, { SearchFormValues } from "@/components/SearchForm";
import FilterBar, { FilterValue } from "@/components/FilterBar";
import BusinessCard from "@/components/BusinessCard";
import SkeletonCard from "@/components/SkeletonCard";
import SavedLeadsPanel from "@/components/SavedLeadsPanel";
import SummaryBar from "@/components/SummaryBar";
import { Business, LeadStatus } from "@/lib/types";
import {
  clearAllLeads,
  getSavedLeads,
  removeLead,
  saveLead,
  updateLeadNotes,
  updateLeadStatus,
} from "@/lib/savedLeads";

const SKELETON_COUNT = 6;

export default function HomePage() {
  const [results, setResults] = useState<Business[]>([]);
  const [requestedCount, setRequestedCount] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedLeads, setSavedLeads] = useState<ReturnType<typeof getSavedLeads>>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  // Loaded after mount (not during initial render) so server and client HTML
  // match on first paint — localStorage isn't available during SSR.
  useEffect(() => {
    setSavedLeads(getSavedLeads());
  }, []);

  const savedIds = useMemo(() => new Set(savedLeads.map((lead) => lead.placeId)), [savedLeads]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((b) => b.websiteStatus === filter);
  }, [results, filter]);

  const counts = useMemo(
    () => ({
      all: results.length,
      none: results.filter((b) => b.websiteStatus === "none").length,
      listed: results.filter((b) => b.websiteStatus === "listed").length,
    }),
    [results]
  );

  async function handleSearch(values: SearchFormValues) {
    if (isLoading) return; // avoid duplicate/concurrent requests

    if (!values.businessType || !values.location) {
      setHasSearched(true);
      setError("Please enter both a business type and a location.");
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsEmptyResult(false);
    setWarning(null);
    setHasSearched(true);
    setFilter("all");
    setRequestedCount(values.resultCount);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setResults([]);
        if (res.status === 404) {
          setIsEmptyResult(true);
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setResults(data.results);
      if (data.warning) setWarning(data.warning);
    } catch {
      setResults([]);
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSave(business: Business) {
    setSavedLeads(saveLead(business));
  }

  function handleRemove(placeId: string) {
    setSavedLeads(removeLead(placeId));
  }

  function handleClearAll() {
    setSavedLeads(clearAllLeads());
  }

  function handleUpdateStatus(placeId: string, status: LeadStatus) {
    setSavedLeads(updateLeadStatus(placeId, status));
  }

  function handleUpdateNotes(placeId: string, notes: string) {
    setSavedLeads(updateLeadNotes(placeId, notes));
  }

  const showResults = !isLoading && hasSearched && !error && !isEmptyResult && results.length > 0;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find Businesses Without Websites
          </h1>
          <p className="mt-2 text-muted">
            Search local businesses and discover potential website leads.
          </p>
        </div>
        <button
          onClick={() => setShowSavedPanel(true)}
          className="shrink-0 self-start rounded-lg border border-fg/20 px-4 py-2 text-sm text-fg hover:border-fg/40"
        >
          Saved Leads ({savedLeads.length})
        </button>
      </header>

      <SummaryBar
        totalResults={counts.all}
        noWebsite={counts.none}
        websiteListed={counts.listed}
        savedCount={savedLeads.length}
      />

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <p className="text-sm text-muted">Searching Google Places…</p>}

      {error && (
        <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg">
          {error}
        </div>
      )}

      {isEmptyResult && !error && (
        <div className="rounded-lg border border-fg/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
          No businesses were found for that search. Try a different business type or location.
        </div>
      )}

      {warning && !error && (
        <div className="rounded-lg border border-muted/40 bg-muted/10 px-4 py-3 text-sm text-fg">
          {warning}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {showResults && (
        <>
          <p className="text-sm text-muted">
            Showing {results.length} of {requestedCount ?? results.length} requested results.
          </p>

          <FilterBar value={filter} onChange={setFilter} counts={counts} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((business) => (
              <BusinessCard
                key={business.placeId}
                business={business}
                isSaved={savedIds.has(business.placeId)}
                onSave={handleSave}
              />
            ))}
          </div>

          {filteredResults.length === 0 && (
            <p className="text-sm text-muted">No businesses match this filter.</p>
          )}
        </>
      )}

      {!hasSearched && !isLoading && (
        <p className="rounded-lg border border-fg/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-muted">
          Enter a business type and location above, then click Find Leads to start prospecting.
        </p>
      )}

      {showSavedPanel && (
        <SavedLeadsPanel
          leads={savedLeads}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
          onUpdateStatus={handleUpdateStatus}
          onUpdateNotes={handleUpdateNotes}
          onClose={() => setShowSavedPanel(false)}
        />
      )}
    </main>
  );
}
