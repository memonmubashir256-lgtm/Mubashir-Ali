import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCatalog: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateCatalog,
}) => {
  const { products, setSelectedCategory } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleCategoryQuickFilter = (slug: string) => {
    setSelectedCategory(slug);
    onClose();
    onNavigateCatalog();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl">
        {/* Search input header */}
        <div className="p-4 border-b border-[#262A33] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9298A2] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search monolithic systems, ceramic pods, docks, specs..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#F5F5F3] placeholder-[#9298A2] focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9298A2] hover:text-[#F5F5F3]"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-[#9298A2] border border-[#262A33] px-1.5 py-0.5 rounded">
              ESC
            </span>
          )}
        </div>

        {/* Results or Suggested searches */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            <div className="space-y-4 py-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
                Explore By Hardware Architecture
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryQuickFilter('devices')}
                  className="px-3 py-1.5 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded-lg text-xs text-[#F5F5F3] transition-colors"
                >
                  Pod Systems
                </button>
                <button
                  onClick={() => handleCategoryQuickFilter('pods-coils')}
                  className="px-3 py-1.5 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded-lg text-xs text-[#F5F5F3] transition-colors"
                >
                  Ceramic Cartridges
                </button>
                <button
                  onClick={() => handleCategoryQuickFilter('power-docks')}
                  className="px-3 py-1.5 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded-lg text-xs text-[#F5F5F3] transition-colors"
                >
                  Charging Docks
                </button>
                <button
                  onClick={() => handleCategoryQuickFilter('cases-sleeves')}
                  className="px-3 py-1.5 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded-lg text-xs text-[#F5F5F3] transition-colors"
                >
                  Leather Sleeves
                </button>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
                Matching Specifications ({results.length})
              </p>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-[#08090B]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#F5F5F3]">{product.name}</p>
                      <p className="text-[11px] font-mono text-[#9298A2]">
                        {product.categoryName} · {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#F5F5F3] tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5CBD3]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#9298A2] space-y-2">
              <p className="text-sm font-semibold text-[#F5F5F3]">No results for &ldquo;{query}&rdquo;</p>
              <p>Check spelling or search for broader terminology such as &ldquo;pod&rdquo; or &ldquo;dock&rdquo;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
