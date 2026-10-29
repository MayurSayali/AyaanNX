import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Sun, Moon, Menu, X, ShieldAlert, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (page: string, param?: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, activePage }) => {
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', page: 'shop' },
    { label: 'Baggy Jeans', page: 'shop', category: 'baggy-jeans' },
    { label: 'Shirts', page: 'shop', category: 'shirts' },
    { label: 'Linen', page: 'shop', category: 'linen' },
    { label: 'Ladies Wear', page: 'shop', category: 'ladies-wear' },
    { label: 'Traditional', page: 'shop', category: 'traditional' },
    { label: 'Atelier', page: 'about' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-neutral-950 dark:bg-black text-neutral-300 border-b border-neutral-800 text-[11px] py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-4">
        <span>COMPLIMENTARY DOMESTIC COURIER OVER ₹3,999</span>
        <span className="hidden sm:inline text-neutral-600">·</span>
        <span className="hidden sm:inline text-amber-400 font-mono">USE CODE: AYAAN10 FOR 10% OFF</span>
      </div>

      {/* Main Navigation (3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
          
          {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="text-left group flex items-baseline gap-1.5 focus:outline-none"
            >
              <span className="font-bebas text-2xl sm:text-3xl tracking-widest text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors whitespace-nowrap">
                AYAAN NX
              </span>
              <span className="text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase font-semibold">
                MUMBAI
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-medium text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page, link.category)}
                className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap py-1 relative ${
                  activePage === link.page
                    ? 'text-neutral-950 dark:text-white font-semibold'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary affordance & action cluster */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Live Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Search collection"
              title="Search collection (⌘K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Toggle dark/light theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
              )}
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => onNavigate('account', 'wishlist')}
              className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950 text-[10px] font-mono font-bold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setUserDropdownOpen(!userDropdownOpen);
                  } else {
                    onNavigate('auth');
                  }
                }}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                aria-label="User account"
                title={isAuthenticated ? user?.name : 'Sign In'}
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {isAuthenticated && (
                  <span className="hidden lg:inline text-xs font-medium max-w-[80px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-none py-2 z-50 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                    Signed in as <strong className="text-neutral-900 dark:text-neutral-100 block truncate">{user?.email}</strong>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('account', 'orders');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('account', 'wishlist');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Wishlist ({wishlistCount})
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('account', 'addresses');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Saved Addresses
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-4 py-2 text-amber-500 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Button (Triggers Drawer) */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-amber-300 transition-colors shadow-sm"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums font-mono font-bold">({itemCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.page, link.category);
                }}
                className="block w-full text-left py-2 text-xs uppercase tracking-widest font-medium text-neutral-800 dark:text-neutral-200"
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="block w-full text-left py-2 text-xs uppercase tracking-widest font-medium text-amber-500"
              >
                Admin Panel
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
