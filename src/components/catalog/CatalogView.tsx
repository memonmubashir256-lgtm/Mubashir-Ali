import React, { useState, useMemo } from 'react';
import { Product, SortOption } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useCompliance } from '../../context/ComplianceContext';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, Info, ShieldCheck } from 'lucide-react';

interface CatalogViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateAdmin?: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectProduct, onNavigateAdmin }) => {
  const { products, categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useStore();
  const { settings, isCommercePermitted } = useCompliance();

  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger brief skeleton simulation on category switch for realistic feel
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 200);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isPublished);

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, inStockOnly, searchQuery, sortOption]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setSortOption('featured');
  };

  return (
    <div className="py-12 bg-[#08090B] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
            <span>Catalog Architecture</span>
            <span aria-hidden="true">·</span>
            <span>{filteredProducts.length} Specifications Available</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F3] font-display">
            The Complete VYRO Hardware Suite
          </h1>
          <p className="text-sm text-[#9298A2] max-w-2xl leading-relaxed">
            Explore monolithic pod vaporizers, precision C-Cell replacement cartridges, magnetic docking platforms, and handcrafted Italian leather sleeves.
          </p>
        </div>

        {/* Regulatory Status Banner */}
        <div className="p-4 bg-[#121419] border border-[#262A33] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-[#C5CBD3] shrink-0" />
            <p className="text-[#9298A2] leading-relaxed">
              <strong className="text-[#F5F5F3]">
                {settings.commerceMode === 'DEMO_INFORMATIONAL'
                  ? 'Informational Catalog Mode Active: '
                  : 'Sandbox Commerce Mode: '}
              </strong>
              {settings.commerceMode === 'DEMO_INFORMATIONAL'
                ? 'Catalog displays verified specifications and regulatory disclosures. Direct online checkout is locked until operator clearance.'
                : 'Test transaction sandbox enabled. Simulated orders with age verification can be placed.'}
            </p>
          </div>
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="text-[#C5CBD3] underline hover:text-white shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Configure in Admin</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="space-y-4 pt-2">
          {/* Top row: Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9298A2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hardware, SKU, materials..."
                className="w-full bg-[#121419] border border-[#262A33] rounded-lg pl-10 pr-9 py-2.5 text-xs text-[#F5F5F3] placeholder-[#9298A2] focus:outline-none focus:border-[#C5CBD3] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9298A2] hover:text-[#F5F5F3]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Quick Stock Filter */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-[#9298A2] cursor-pointer bg-[#121419] border border-[#262A33] px-3 py-2.5 rounded-lg select-none hover:text-[#F5F5F3]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#262A33] bg-[#08090B] text-[#C5CBD3] focus:ring-0 focus:ring-offset-0"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2 bg-[#121419] border border-[#262A33] px-3 py-1.5 rounded-lg">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#9298A2]" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent text-xs text-[#F5F5F3] focus:outline-none cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="featured" className="bg-[#121419] text-[#F5F5F3]">
                    Featured First
                  </option>
                  <option value="price-asc" className="bg-[#121419] text-[#F5F5F3]">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-[#121419] text-[#F5F5F3]">
                    Price: High to Low
                  </option>
                  <option value="name-asc" className="bg-[#121419] text-[#F5F5F3]">
                    Alphabetical
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs (Segmented control button elements with click handlers) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#F5F5F3] text-[#08090B] shadow-sm font-semibold'
                  : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3] border border-[#262A33]'
              }`}
            >
              All Products ({products.filter((p) => p.isPublished).length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id && p.isPublished).length;
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#F5F5F3] text-[#08090B] shadow-sm font-semibold'
                      : 'bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3] border border-[#262A33]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid / Skeleton / Empty state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#121419] rounded-xl border border-[#262A33] p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#1A1D23] rounded-lg" />
                <div className="h-4 bg-[#1A1D23] rounded w-1/3" />
                <div className="h-5 bg-[#1A1D23] rounded w-3/4" />
                <div className="h-4 bg-[#1A1D23] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#121419] border border-[#262A33] rounded-xl p-8 space-y-4">
            <p className="text-lg font-semibold text-[#F5F5F3]">No matching hardware discovered</p>
            <p className="text-xs text-[#9298A2] max-w-sm mx-auto">
              No products correspond to the current criteria &ldquo;{searchQuery}&rdquo;. Try clearing filters or searching for alternative specifications.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-[#1A1D23] hover:bg-[#262A33] text-[#F5F5F3] text-xs font-medium rounded-lg border border-[#262A33] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
