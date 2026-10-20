import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ComplianceProvider } from './context/ComplianceContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedGrid } from './components/home/FeaturedGrid';
import { BrandPhilosophy } from './components/home/BrandPhilosophy';
import { FaqSection } from './components/home/FaqSection';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { SearchModal } from './components/search/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { AccountDashboard } from './components/account/AccountDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AgeVerificationModal } from './components/compliance/AgeVerificationModal';
import { PolicyModal } from './components/compliance/PolicyModal';
import { ToastContainer } from './components/ui/ToastContainer';

type ViewMode = 'home' | 'catalog' | 'admin' | 'account';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { products, selectedProduct, setSelectedProduct } = useStore();

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F3] flex flex-col font-sans selection:bg-[#C5CBD3] selection:text-[#08090B]">
      {/* Top Compliance Bar */}
      <AnnouncementBar />

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Primary Page Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onExplore={() => handleNavigate('catalog')}
              onDiscover={() => {
                const el = document.getElementById('philosophy-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <FeaturedGrid
              onViewAll={() => handleNavigate('catalog')}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
            <BrandPhilosophy />
            <FaqSection />
          </>
        )}

        {currentView === 'catalog' && (
          <CatalogView
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onNavigateAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentView === 'admin' && <AdminDashboard />}

        {currentView === 'account' && (
          <AccountDashboard onNavigateCatalog={() => handleNavigate('catalog')} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectRelated={(prod) => setSelectedProduct(prod)}
        allProducts={products}
      />

      <CartDrawer onNavigateCatalog={() => handleNavigate('catalog')} />
      <CheckoutModal />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onNavigateCatalog={() => handleNavigate('catalog')}
      />
      <AuthModal />
      <AgeVerificationModal />
      <PolicyModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ComplianceProvider>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <MainContent />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </ComplianceProvider>
    </ToastProvider>
  );
}
