"use client";

import { FormEvent, useState } from "react";

export interface SearchFormValues {
  businessType: string;
  location: string;
  resultCount: 20 | 50 | 100;
}

interface Props {
  onSearch: (values: SearchFormValues) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [resultCount, setResultCount] = useState<20 | 50 | 100>(20);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLoading) return; // guard against duplicate submissions
    onSearch({ businessType: businessType.trim(), location: location.trim(), resultCount });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-fg/10 bg-white/[0.02] p-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="businessType" className="text-sm text-muted">
          Business type
        </label>
        <input
          id="businessType"
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="e.g. Dentist"
          disabled={isLoading}
          className="rounded-lg border border-fg/15 bg-bg px-3 py-2 text-fg placeholder:text-muted/70 outline-none focus:border-accent disabled:opacity-50"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="text-sm text-muted">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Riyadh, Saudi Arabia"
          disabled={isLoading}
          className="rounded-lg border border-fg/15 bg-bg px-3 py-2 text-fg placeholder:text-muted/70 outline-none focus:border-accent disabled:opacity-50"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="resultCount" className="text-sm text-muted">
          Number of results
        </label>
        <select
          id="resultCount"
          value={resultCount}
          onChange={(e) => setResultCount(Number(e.target.value) as 20 | 50 | 100)}
          disabled={isLoading}
          className="rounded-lg border border-fg/15 bg-bg px-3 py-2 text-fg outline-none focus:border-accent disabled:opacity-50"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-accent px-4 py-2 font-medium text-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Searching..." : "Find Leads"}
      </button>
    </form>
  );
}
