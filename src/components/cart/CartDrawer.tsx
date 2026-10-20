import React from 'react';
import { useCart } from '../../context/CartContext';
import { useCompliance } from '../../context/ComplianceContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onNavigateCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateCatalog }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  } = useCart();

  const { settings, isCommercePermitted } = useCompliance();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#08090B] border-l border-[#262A33] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#262A33] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C5CBD3]" />
            <h2 className="text-base font-bold text-[#F5F5F3] tracking-wide">
              Shopping Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-2 text-[#9298A2] hover:text-[#F5F5F3] rounded-lg hover:bg-[#1A1D23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-[#9298A2]/40 mx-auto" />
              <p className="text-sm font-semibold text-[#F5F5F3]">Your bag is empty</p>
              <p className="text-xs text-[#9298A2] max-w-xs mx-auto">
                Explore the collection to select monolithic systems, ceramic cartridges, or precision accessories.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigateCatalog();
                }}
                className="mt-4 px-5 py-2.5 bg-[#F5F5F3] text-[#08090B] text-xs font-semibold rounded-lg hover:bg-[#C5CBD3] transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#121419] border border-[#262A33] rounded-xl flex gap-4 items-center justify-between"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#1A1D23] shrink-0"
                  />

                  <div className="flex-1 min-w-0 px-2 space-y-1">
                    <h3 className="text-xs font-semibold text-[#F5F5F3] truncate">
                      {item.product.name}
                    </h3>
                    {item.variant && (
                      <p className="text-[11px] font-mono text-[#9298A2]">
                        {item.variant.title}
                      </p>
                    )}
                    <p className="text-xs font-mono font-medium text-[#F5F5F3] tabular-nums">
                      ${item.unitPrice.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center bg-[#08090B] border border-[#262A33] rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#9298A2] hover:text-[#F5F5F3]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#9298A2] hover:text-[#F5F5F3]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#9298A2] hover:text-rose-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-[#F5F5F3] tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Totals */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#262A33] bg-[#121419]/90 space-y-4">
            <div className="space-y-2 text-xs text-[#9298A2]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#F5F5F3] tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-[#F5F5F3] tabular-nums">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-[#F5F5F3] tabular-nums">
                  {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#262A33] flex justify-between text-sm font-bold text-[#F5F5F3]">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
            >
              <span>{isCommercePermitted ? 'Proceed to Secure Checkout' : 'Initiate Compliance Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#9298A2]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Age {settings.minimumAge}+ Verification required prior to dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
