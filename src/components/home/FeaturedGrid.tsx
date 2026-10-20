import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { ArrowUpRight, Plus, Eye } from 'lucide-react';

interface FeaturedGridProps {
  onViewAll: () => void;
  onSelectProduct: (product: Product) => void;
}

export const FeaturedGrid: React.FC<FeaturedGridProps> = ({ onViewAll, onSelectProduct }) => {
  const { products } = useStore();
  const { addItem } = useCart();
  const { isCommercePermitted } = useCompliance();
  const { addToast } = useToast();

  const featured = products.filter((p) => p.isFeatured || p.isPublished).slice(0, 4);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!isCommercePermitted) {
      addToast(
        'info',
        'Informational Catalog Mode',
        'Online sales are currently in demo compliance review. Explore product specs.'
      );
      onSelectProduct(product);
      return;
    }
    const defaultVariant = product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, defaultVariant, 1);
    addToast('success', 'Added to Cart', `${product.name} has been added to your bag.`);
  };

  return (
    <section className="py-24 bg-[#08090B] border-b border-[#1A1D23]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
              The Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F3] tracking-tight font-display">
              Featured Systems & Hardware
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C5CBD3] hover:text-[#F5F5F3] transition-colors group"
          >
            <span>View Full Catalog</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 3-to-4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product) => {
            const primaryImg = product.images[0]?.url || '';

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer bg-[#121419] rounded-xl border border-[#262A33] hover:border-[#C5CBD3]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Image Container (65-70% height) */}
                <div className="relative aspect-[4/3] bg-[#1A1D23] overflow-hidden">
                  <img
                    src={primaryImg}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Clean unboxed single text status, no colored pill badges */}
                  <div className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wider text-[#9298A2] bg-[#08090B]/80 backdrop-blur-sm px-2 py-0.5 rounded">
                    {product.stock > 0 ? `${product.stock} Units Reserve` : 'Out of Stock'}
                  </div>

                  {/* Quick Action Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      aria-label="View specifications"
                      className="p-3 bg-[#08090B] text-[#F5F5F3] rounded-full hover:bg-white hover:text-black transition-colors shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      aria-label="Quick add to bag"
                      className="p-3 bg-[#C5CBD3] text-[#08090B] rounded-full hover:bg-white transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata & Title */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    {/* Unboxed category label */}
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#9298A2]">
                      {product.categoryName}
                    </p>
                    <h3 className="text-base font-semibold text-[#F5F5F3] group-hover:text-white transition-colors mt-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#9298A2] line-clamp-2 mt-1 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1D23] flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold font-mono tabular-nums text-[#F5F5F3]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-[#9298A2] line-through font-mono tabular-nums">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#C5CBD3] group-hover:underline">
                      Inspect →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
