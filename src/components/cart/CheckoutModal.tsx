import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { Order, ShippingAddress } from '../../types';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { items, subtotal, tax, shipping, total, clearCart, isCheckoutOpen, setIsCheckoutOpen } =
    useCart();
  const { addOrder } = useStore();
  const { user } = useAuth();
  const { settings, isCommercePermitted } = useCompliance();
  const { addToast } = useToast();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form fields
  const [fullName, setFullName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState('450 Sutter St');
  const [apartment, setApartment] = useState('Floor 12');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94108');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState(user?.phone || '+1 (415) 555-0199');
  const [birthYear, setBirthYear] = useState('1998');
  const [ageAffirmation, setAgeAffirmation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCommercePermitted) {
      addToast(
        'error',
        'Compliance Restriction',
        'Purchasing is locked in Informational Catalog Mode. You can enable Sandbox Commerce in Admin Console.'
      );
      return;
    }

    if (!ageAffirmation) {
      addToast('error', 'Age Requirement', `You must verify you are ${settings.minimumAge}+.`);
      return;
    }

    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(birthYear, 10);
    if (isNaN(parsedYear) || currentYear - parsedYear < settings.minimumAge) {
      addToast(
        'error',
        'Age Verification Failed',
        `Consumers must be at least ${settings.minimumAge} years old to receive vapor hardware.`
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const shippingAddress: ShippingAddress = {
        fullName,
        street,
        apartment,
        city,
        state,
        postalCode,
        country,
        phone,
      };

      const orderNumber = `VYR-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: user?.id,
        customerEmail: email,
        status: 'AGE_VERIFIED',
        subtotal,
        tax,
        shippingCost: shipping,
        total,
        currency: 'USD',
        ageVerifiedSnapshot: true,
        ageVerifiedMethod: 'ID_JURISDICTION_SANDBOX_ASSERTION',
        shippingAddress,
        items: items.map((item) => ({
          id: `oi-${Math.random().toString(36).substr(2, 6)}`,
          productId: item.productId,
          productName: item.product.name,
          productSku: item.variant?.sku || item.product.sku,
          variantTitle: item.variant?.title,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.unitPrice * item.quantity,
        })),
        createdAt: new Date().toISOString(),
        paymentMethod: 'SANDBOX_GATEWAY_TEST',
        isDemoTransaction: true,
      };

      addOrder(newOrder);
      setCreatedOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setStep('success');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F5F5F3', '#C5CBD3', '#9298A2'],
        });
      } catch (err) {
        console.error(err);
      }
    }, 900);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
    setCreatedOrder(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#262A33] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5CBD3]" />
            <h2 className="text-base font-bold text-[#F5F5F3]">
              {step === 'details' ? 'Secure Checkout & Compliance Verification' : 'Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="p-1.5 text-[#9298A2] hover:text-[#F5F5F3] rounded-lg hover:bg-[#1A1D23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleCompleteOrder} className="p-6 sm:p-8 space-y-6">
            {/* Informational warning if demo mode is active */}
            {!isCommercePermitted && (
              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Informational Catalog Mode Active</p>
                  <p className="text-amber-200/80 mt-1 leading-relaxed">
                    Orders cannot be completed while in strict demo mode. To enable simulated test transactions, switch commerce mode to &ldquo;Sandbox Commerce&rdquo; in the Admin Console.
                  </p>
                </div>
              </div>
            )}

            {/* Statutory Age Gate Verification Module */}
            <div className="p-4 bg-[#121419] border border-[#262A33] rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C5CBD3]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Age Verification ({settings.minimumAge}+)</span>
              </div>
              <p className="text-xs text-[#9298A2] leading-relaxed">
                By law, vapor hardware and accessories may only be sold to adults of verified legal age.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                    Birth Year
                  </label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    min="1920"
                    max="2010"
                    className="w-full bg-[#08090B] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9298A2] mb-1">
                    Phone (SMS Delivery Verification)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#08090B] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
              </div>
              <label className="flex items-start gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ageAffirmation}
                  onChange={(e) => setAgeAffirmation(e.target.checked)}
                  className="mt-0.5 rounded border-[#262A33] bg-[#08090B] text-[#C5CBD3] focus:ring-0"
                  required
                />
                <span className="text-[11px] text-[#9298A2] leading-tight">
                  I solemnly affirm that I am at least {settings.minimumAge} years of age and acknowledge that identity verification is logged for legal compliance.
                </span>
              </label>
            </div>

            {/* Shipping Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#9298A2]">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-[#9298A2] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">Apartment / Suite</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9298A2] mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Strip */}
            <div className="p-4 bg-[#121419] border border-[#262A33] rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#9298A2]">Order Subtotal ({items.length} items + Tax):</span>
              <span className="text-sm font-mono font-bold text-[#F5F5F3] tabular-nums">
                ${total.toFixed(2)} USD
              </span>
            </div>

            {/* Sandbox Notice & Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isCommercePermitted}
                className={`w-full py-3.5 px-6 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isCommercePermitted
                    ? 'bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] shadow-lg active:scale-[0.98]'
                    : 'bg-[#1A1D23] text-[#9298A2] cursor-not-allowed border border-[#262A33]'
                }`}
              >
                {isSubmitting ? (
                  <span>Executing Server Verification...</span>
                ) : (
                  <>
                    <span>Place Sandbox Order (Test Mode)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#9298A2]/80 mt-2 font-mono">
                TEST SIMULATION · NO REAL PAYMENT CAPTURED
              </p>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9298A2]">
                Order Reconciled
              </span>
              <h3 className="text-2xl font-bold text-[#F5F5F3] font-display">
                Receipt #{createdOrder?.orderNumber}
              </h3>
              <p className="text-xs text-[#9298A2] max-w-sm mx-auto">
                Adult age verification audit assertion successfully passed. A confirmation dispatch has been sent to {createdOrder?.customerEmail}.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 bg-[#121419] border border-[#262A33] rounded-xl text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b border-[#1A1D23] pb-2 text-[#9298A2]">
                <span>Status</span>
                <span className="text-emerald-400 font-mono">AGE VERIFIED</span>
              </div>
              <div className="flex justify-between border-b border-[#1A1D23] pb-2 text-[#9298A2]">
                <span>Recipient</span>
                <span className="text-[#F5F5F3]">{createdOrder?.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1A1D23] pb-2 text-[#9298A2]">
                <span>Destination</span>
                <span className="text-[#F5F5F3]">
                  {createdOrder?.shippingAddress.city}, {createdOrder?.shippingAddress.state}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F5F5F3] pt-1">
                <span>Total Reconciled</span>
                <span className="font-mono tabular-nums">
                  ${createdOrder?.total.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#F5F5F3] text-[#08090B] text-xs font-semibold rounded-lg hover:bg-[#C5CBD3] transition-colors"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
