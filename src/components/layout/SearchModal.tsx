import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  categoryLabel: string;
  rating: number;
  stock: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (slugOrId: string) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      onViewAllResults(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-2xl overflow-hidden">
        {/* Input bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search heavyweight hoodies, cargo pants, outerwear..."
            className="w-full bg-transparent text-sm md:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
          {query && !isLoading && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white pl-2 border-l border-neutral-800"
          >
            ESC
          </button>
        </div>

        {/* Live Suggestions Results */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-neutral-800/60 p-2">
          {query.trim() && suggestions.length === 0 && !isLoading && (
            <div className="p-8 text-center text-xs text-neutral-400">
              No garments matching "{query}". Try "hoodie", "cargo", or "varsity".
            </div>
          )}

          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectProduct(item.slug || item.id);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-neutral-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-800 overflow-hidden shrink-0 border border-neutral-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase tracking-wider">
                    {item.categoryLabel}
                  </div>
                  <div className="text-xs font-semibold text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs tabular-nums font-semibold text-neutral-200">
                  {formatPrice(item.price)}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}

          {query.trim() && suggestions.length > 0 && (
            <div className="p-3 text-center bg-neutral-950/40">
              <button
                onClick={() => {
                  onViewAllResults(query.trim());
                  onClose();
                }}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 tracking-wider uppercase inline-flex items-center gap-1.5"
              >
                View all results for "{query}"
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!query.trim() && (
            <div className="p-6">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-3 font-semibold">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Heavyweight Hoodie', 'Pleated Cargo', 'Monogram Tee', 'Varsity Jacket', 'Acid Wash'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 text-xs bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
