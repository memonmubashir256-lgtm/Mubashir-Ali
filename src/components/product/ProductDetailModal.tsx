import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { X, Check, ShieldCheck, ArrowRight, Minus, Plus, AlertCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectRelated: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectRelated,
  allProducts,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const { isCommercePermitted, settings } = useCompliance();
  const { addToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant
    ? product.price + selectedVariant.priceDelta
    : product.price;

  const handleAddToCart = () => {
    if (!isCommercePermitted) {
      addToast(
        'info',
        'Informational Catalog',
        'Online ordering is currently held in regulatory demo mode. You can switch to Sandbox Commerce in the Admin Console.'
      );
      return;
    }

    if (product.stock <= 0) {
      addToast('error', 'Out of Stock', 'This specification is temporarily out of reserve.');
      return;
    }

    addItem(product, selectedVariant, quantity);
    addToast('success', 'Added to Cart', `${quantity}x ${product.name} added to your bag.`);
  };

  const related = allProducts
    .filter((p) => p.id !== product.id && p.isPublished)
    .slice(0, 3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#121419]/80 hover:bg-[#1A1D23] text-[#9298A2] hover:text-[#F5F5F3] rounded-full border border-[#262A33] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#121419] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262A33]">
            {/* Breadcrumb without pill badges */}
            <nav className="flex items-center gap-2 text-xs font-mono text-[#9298A2] mb-6">
              <span>VYRO</span>
              <span aria-hidden="true">/</span>
              <span>{product.categoryName}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#F5F5F3] font-medium">{product.sku}</span>
            </nav>

            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1A1D23] border border-[#262A33] mb-6">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.images[selectedImageIndex]?.altText || product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 aspect-square rounded-lg overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#F5F5F3] ring-1 ring-[#F5F5F3]'
                        : 'border-[#262A33] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Editorial Quote */}
            {product.editorialHighlight && (
              <div className="mt-8 p-4 bg-[#1A1D23]/60 border border-[#262A33] rounded-lg">
                <p className="text-xs text-[#9298A2] italic leading-relaxed">
                  &ldquo;{product.editorialHighlight}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module & Specifications */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
                  {product.categoryName}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F3] font-display mt-1">
                  {product.name}
                </h2>
                <p className="text-xs text-[#9298A2] mt-1 font-mono">
                  SKU: {selectedVariant?.sku || product.sku}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl font-bold font-mono tabular-nums text-[#F5F5F3]">
                    ${currentPrice.toFixed(2)} USD
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm font-mono text-[#9298A2] line-through tabular-nums">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#9298A2] leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9298A2] uppercase tracking-wider font-mono">
                      Selected Finish
                    </span>
                    <span className="text-[#F5F5F3] font-medium">
                      {selectedVariant?.finishName || selectedVariant?.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'border-[#F5F5F3] bg-[#1A1D23] text-white shadow-sm'
                              : 'border-[#262A33] bg-[#121419] text-[#9298A2] hover:text-[#F5F5F3] hover:border-[#3A3F4A]'
                          }`}
                        >
                          {v.colorCode && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: v.colorCode }}
                            />
                          )}
                          <span>{v.title}</span>
                          {v.priceDelta !== 0 && (
                            <span className="text-[10px] text-[#9298A2] font-mono">
                              {v.priceDelta > 0 ? `+$${v.priceDelta}` : `-$${Math.abs(v.priceDelta)}`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Compatibility Check */}
              {product.compatibility && (
                <div className="p-3 bg-[#121419] border border-[#262A33] rounded-lg space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#9298A2]">
                    Hardware Compatibility
                  </span>
                  <p className="text-xs text-[#C5CBD3] leading-relaxed">
                    {product.compatibility}
                  </p>
                </div>
              )}

              {/* Purchase Controls & Quantity */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#121419] border border-[#262A33] rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#9298A2] hover:text-[#F5F5F3] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-[#F5F5F3] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-[#9298A2] hover:text-[#F5F5F3] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                  >
                    <span>{isCommercePermitted ? 'Add to Bag' : 'Review in Catalog'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Regulatory informational banner */}
                {!isCommercePermitted && (
                  <p className="text-[11px] text-[#9298A2] flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Transactions locked in Informational Demo Mode.</span>
                  </p>
                )}
              </div>

              {/* Technical Specifications Matrix */}
              <div className="pt-4 border-t border-[#1A1D23] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-[#1A1D23] text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => {
                    if (!val) return null;
                    const formatKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                    return (
                      <div key={key} className="py-2 flex items-center justify-between gap-4">
                        <span className="text-[#9298A2] capitalize">{formatKey}</span>
                        <span className="text-[#F5F5F3] font-mono text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Compliance footnote */}
            <div className="pt-6 border-t border-[#1A1D23] flex items-center gap-2 text-[11px] text-[#9298A2]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Verified Adult ({settings.minimumAge}+) Compliant Device</span>
            </div>
          </div>
        </div>

        {/* Related Accessories Shelf */}
        {related.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#121419]/50 border-t border-[#262A33]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9298A2] mb-4">
              Compatible Hardware & Accessories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-3 bg-[#121419] border border-[#262A33] hover:border-[#C5CBD3]/50 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={rel.images[0]?.url}
                    alt={rel.name}
                    className="w-12 h-12 object-cover rounded bg-[#1A1D23]"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-[#F5F5F3] truncate">{rel.name}</p>
                    <p className="text-[11px] font-mono text-[#9298A2] tabular-nums">
                      ${rel.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
