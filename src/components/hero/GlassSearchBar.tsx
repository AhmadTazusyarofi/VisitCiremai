import type { JSX } from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Category } from "../../types/package";
import { LiquidGlass } from "../ui/LiquidGlass";

const categories: Category[] = [
  "Pendakian Gunung Hutan",
  "Petualangan Lainnya",
  "Akomodasi",
  "Transportasi",
  "Sewa Alat",
];

export function GlassSearchBar(): JSX.Element {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Petualangan Lainnya");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend/navigation yet — a later integration can wire this up.
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      {/* Text input pill — whole pill is the typing area */}
      <LiquidGlass className="flex-1 rounded-full focus-within:ring-2 focus-within:ring-white/80">
        <label
          htmlFor="q"
          className="flex h-12 cursor-text items-center gap-3 px-5"
        >
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-white/80" />
          <input
            id="q"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari destinasi atau paket…"
            aria-label="Cari destinasi atau paket"
            className="w-full min-w-0 bg-transparent text-white placeholder-white/70 outline-none"
          />
        </label>
      </LiquidGlass>

      {/* Category dropdown pill — select fills the whole pill */}
      <label htmlFor="cat" className="sr-only">
        Kategori
      </label>
      <LiquidGlass className="rounded-full focus-within:ring-2 focus-within:ring-white/80 sm:w-56">
        <select
          id="cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-12 w-full min-w-0 cursor-pointer rounded-full bg-transparent px-5 text-white outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="text-ink">
              {c}
            </option>
          ))}
        </select>
      </LiquidGlass>

      {/* Round search button pill */}
      <LiquidGlass className="h-12 w-12 shrink-0 rounded-full max-sm:w-full">
        <button
          type="submit"
          aria-label="Cari paket"
          className="flex h-full w-full items-center justify-center gap-2 rounded-full py-3 text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none max-sm:font-semibold"
        >
          <Search aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span className="sm:hidden">Cari</span>
        </button>
      </LiquidGlass>
    </form>
  );
}
