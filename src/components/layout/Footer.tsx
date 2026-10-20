import React, { useState } from 'react';
import { useCompliance } from '../../context/ComplianceContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'catalog' | 'admin' | 'account') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, setActivePolicyModal, resetAgeVerification } = useCompliance();
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    addToast('success', 'Subscribed', 'You have been enrolled in exclusive VYRO product dispatches.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#08090B] border-t border-[#1A1D23] text-[#9298A2] transition-colors">
      {/* Statutory Health & Age Warning Strip */}
      <div className="border-b border-[#1A1D23] bg-[#121419]/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[#F5F5F3] font-mono">
              AGE RESTRICTION ({settings.minimumAge}+)
            </span>
            <span aria-hidden="true">·</span>
            <span>Intended exclusively for verified adult consumers.</span>
          </div>
          <button
            onClick={() => resetAgeVerification()}
            className="text-xs text-[#C5CBD3] hover:underline"
          >
            Re-verify Age Status
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold tracking-[0.2em] text-[#F5F5F3]">
              VYRO
            </h3>
            <p className="text-sm text-[#9298A2] leading-relaxed max-w-sm">
              Engineered with uncompromising precision. Designed for those who demand tactile perfection, monolithic form, and pure vaporization fidelity.
            </p>
            <div className="pt-2 text-xs text-[#9298A2]/80 space-y-1">
              <p>Platform Architecture: Clean Monolithic React & Express</p>
              <p>Operational Mode: {settings.commerceMode.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Collection
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  Pod Devices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  Ceramic Cartridges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  Charging Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  Leather Sleeves
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActivePolicyModal('compliance')}
                  className="hover:text-[#F5F5F3] transition-colors text-left"
                >
                  Age Verification Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="hover:text-[#F5F5F3] transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-[#F5F5F3] transition-colors text-left"
                >
                  Privacy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('shipping')}
                  className="hover:text-[#F5F5F3] transition-colors text-left"
                >
                  Restricted Jurisdictions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#F5F5F3] transition-colors text-left flex items-center gap-1.5 text-xs text-[#C5CBD3]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Operator Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Dispatches
            </h4>
            <p className="text-xs text-[#9298A2] leading-relaxed">
              Receive confidential notices on limited reserve releases and technical updates.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#1A1D23] border border-[#262A33] rounded text-xs text-white">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enrolled in reserve dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address"
                    aria-label="Email address for newsletter"
                    className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] placeholder-[#9298A2] focus:outline-none focus:border-[#C5CBD3] transition-colors pr-10"
                    required
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to dispatches"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#1A1D23] hover:bg-[#262A33] text-[#F5F5F3] rounded flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-[#9298A2]/70">
                  By subscribing, you verify you are of legal adult age.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1A1D23] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9298A2]">
          <p>© {new Date().getFullYear()} VYRO Laboratory & Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Server Validation: Active</span>
            <span>Encryption: AES-256</span>
            <span>Monolithic Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
