import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addItem } = useCart();
  const { isCommercePermitted } = useCompliance();
  const { addToast } = useToast();

  const primaryImage = product.images[0]?.url || '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCommercePermitted) {
      addToast(
        'info',
        'Informational Catalog',
        'Direct purchases disabled in demo compliance mode. Inspect specs or enable sandbox in Admin.'
      );
      onSelect(product);
      return;
    }
    const defaultVariant = product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, defaultVariant, 1);
    addToast('success', 'Added to Cart', `${product.name} has been added.`);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group cursor-pointer bg-[#121419] rounded-xl border border-[#262A33] hover:border-[#C5CBD3]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-[#1A1D23] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Stock / Reserve quiet unboxed text status */}
        <div className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wider text-[#9298A2] bg-[#08090B]/85 backdrop-blur-sm px-2.5 py-1 rounded">
          {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label={`View details for ${product.name}`}
            className="p-3 bg-[#08090B] text-[#F5F5F3] rounded-full hover:bg-white hover:text-black transition-colors shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="p-3 bg-[#C5CBD3] text-[#08090B] rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          {/* Metadata line without pill badges */}
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#9298A2]">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.sku}</span>
          </div>

          <h3 className="text-base font-semibold text-[#F5F5F3] group-hover:text-white transition-colors mt-1.5">
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
            View Details →
          </span>
        </div>
      </div>
    </article>
  );
};
