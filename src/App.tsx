import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider } from './components/ui/Toast.js';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';

import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { SearchModal } from './components/layout/SearchModal.js';
import { QuickCartDrawer } from './components/layout/QuickCartDrawer.js';
import { SizeGuideModal } from './components/ui/SizeGuideModal.js';

import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { AccountPage } from './pages/AccountPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FAQPage } from './pages/FAQPage.js';

import { Product, Order } from './types/index.js';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigateTo = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param);
    if (page === 'shop' && param) {
      setGlobalSearch('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (slugOrId: string) => {
    if (!slugOrId) {
      navigateTo('shop');
      return;
    }
    setSelectedProductSlug(slugOrId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllSearchResults = (query: string) => {
    setGlobalSearch(query);
    navigateTo('shop', 'all');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-body transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={navigateTo}
        activePage={currentPage}
      />

      {/* Main Content Router */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            products={products}
            initialCategory={pageParam}
            initialSearch={globalSearch}
            onSelectProduct={handleSelectProduct}
            isLoading={isLoadingProducts}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            slugOrId={selectedProductSlug}
            onSelectProduct={handleSelectProduct}
            onNavigateCheckout={() => navigateTo('checkout')}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onRequireAuth={() => navigateTo('auth')}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            onNavigateCheckout={() => navigateTo('checkout')}
            onContinueShopping={() => navigateTo('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onNavigateCart={() => navigateTo('cart')}
            onNavigateAuth={() => navigateTo('auth')}
          />
        )}

        {currentPage === 'order-confirmation' && completedOrder && (
          <OrderConfirmationPage
            order={completedOrder}
            onContinueShopping={() => navigateTo('shop')}
            onViewAccountOrders={() => navigateTo('account', 'orders')}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            initialTab={(pageParam as any) || 'orders'}
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigateAuth={() => navigateTo('auth')}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            onSuccess={() => navigateTo('account')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            products={products}
            onRefreshProducts={fetchProducts}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigateShop={() => navigateTo('shop')} />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'faq' && <FAQPage />}
      </div>

      {/* Global Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Global Interactive Drawers & Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onViewAllResults={handleViewAllSearchResults}
      />

      <QuickCartDrawer
        onNavigateCheckout={() => navigateTo('checkout')}
        onNavigateCart={() => navigateTo('cart')}
        onContinueShopping={() => navigateTo('shop')}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <MainApp />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
