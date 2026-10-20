import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompliance } from '../../context/ComplianceContext';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, User as UserIcon, Menu, X, Shield, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'catalog' | 'admin' | 'account';
  onNavigate: (view: 'home' | 'catalog' | 'admin' | 'account') => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, setShowAuthModal, setAuthModalMode } = useAuth();
  const { setSelectedCategory } = useStore();
  const { setActivePolicyModal } = useCompliance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'catalog' | 'admin' | 'account', category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (user) {
      onNavigate('account');
    } else {
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08090B]/90 backdrop-blur-md border-b border-[#262A33] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Wordmark (Single text element in display face) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-2xl font-bold tracking-[0.2em] text-[#F5F5F3] hover:text-[#C5CBD3] transition-colors whitespace-nowrap shrink-0 text-left"
          >
            VYRO
          </button>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9298A2]">
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className={`hover:text-[#F5F5F3] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'catalog' ? 'text-[#F5F5F3] underline underline-offset-8 decoration-1 decoration-[#C5CBD3]' : ''
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'devices')}
              className="hover:text-[#F5F5F3] transition-colors whitespace-nowrap shrink-0"
            >
              Pod Systems
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'power-docks')}
              className="hover:text-[#F5F5F3] transition-colors whitespace-nowrap shrink-0"
            >
              Accessories
            </button>
            <button
              onClick={() => {
                handleNavClick('home');
                const el = document.getElementById('philosophy-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#F5F5F3] transition-colors whitespace-nowrap shrink-0"
            >
              Philosophy
            </button>
            <button
              onClick={() => setActivePolicyModal('compliance')}
              className="hover:text-[#F5F5F3] transition-colors whitespace-nowrap shrink-0"
            >
              Compliance
            </button>
          </nav>

          {/* Zone 3: 1 primary action or streamlined action group */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Search trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search collection"
              className="p-2 text-[#9298A2] hover:text-[#F5F5F3] transition-colors rounded-lg hover:bg-[#1A1D23]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Console shortcut if user has admin permission */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                  currentView === 'admin'
                    ? 'bg-[#C5CBD3] text-[#08090B] border-[#C5CBD3]'
                    : 'border-[#262A33] text-[#C5CBD3] hover:bg-[#1A1D23]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Account Profile button */}
            <button
              onClick={handleAccountClick}
              aria-label={user ? 'Account dashboard' : 'Sign in'}
              className={`p-2 transition-colors rounded-lg hover:bg-[#1A1D23] ${
                user ? 'text-[#C5CBD3]' : 'text-[#9298A2] hover:text-[#F5F5F3]'
              }`}
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Cart (${itemCount} items)`}
              className="relative p-2 text-[#F5F5F3] hover:text-[#C5CBD3] transition-colors rounded-lg hover:bg-[#1A1D23]"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold font-mono text-[#08090B] bg-[#C5CBD3] rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#9298A2] hover:text-[#F5F5F3]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121419] border-b border-[#262A33] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-base">
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className="text-left py-2 text-[#F5F5F3] hover:text-[#C5CBD3] border-b border-[#262A33]"
            >
              Explore Collection
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'devices')}
              className="text-left py-2 text-[#9298A2] hover:text-[#F5F5F3] border-b border-[#262A33]"
            >
              Pod Systems
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'pods-coils')}
              className="text-left py-2 text-[#9298A2] hover:text-[#F5F5F3] border-b border-[#262A33]"
            >
              Ceramic Cartridges
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'power-docks')}
              className="text-left py-2 text-[#9298A2] hover:text-[#F5F5F3] border-b border-[#262A33]"
            >
              Charging & Docks
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'cases-sleeves')}
              className="text-left py-2 text-[#9298A2] hover:text-[#F5F5F3] border-b border-[#262A33]"
            >
              Cases & Sleeves
            </button>
            <button
              onClick={() => {
                setActivePolicyModal('compliance');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#C5CBD3] flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Legal Compliance & Age Gate</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left py-2 text-white font-semibold flex items-center gap-2 border-t border-[#262A33] pt-4"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Management Console</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
