import React, { useState, useEffect } from 'react';
import { Package, Heart, MapPin, User, LogOut, Plus, Trash2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { useToast } from '../components/ui/Toast.js';
import { Order, Product, UserAddress } from '../types/index.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { formatPrice } from '../utils/currency.js';

interface AccountPageProps {
  initialTab?: 'orders' | 'wishlist' | 'addresses' | 'profile';
  products: Product[];
  onSelectProduct: (slugOrId: string) => void;
  onNavigateAuth: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  initialTab = 'orders',
  products,
  onSelectProduct,
  onNavigateAuth,
}) => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address add modal / form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, 'id'>>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('ayaan_token');
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-bebas text-3xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
          CLIENT VAULT SIGN IN REQUIRED
        </h2>
        <p className="text-xs text-neutral-500 mb-6 font-body">
          Please log in or register to access your order archives, saved silhouettes, and studio addresses.
        </p>
        <button
          onClick={onNavigateAuth}
          className="w-full py-3 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors"
        >
          Sign In to Account
        </button>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    const payload: any = { name, phone };
    if (newPassword) {
      if (!currentPassword) {
        showToast('Please enter current password to set a new password', 'error');
        setIsUpdatingProfile(false);
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const ok = await updateProfile(payload);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
    }
    setIsUpdatingProfile(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
      showToast('Please fill out all mandatory address fields', 'error');
      return;
    }

    const currentAddresses = user?.addresses || [];
    const created: UserAddress = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };

    const updated = newAddress.isDefault
      ? [created, ...currentAddresses.map((a) => ({ ...a, isDefault: false }))]
      : [...currentAddresses, created];

    await updateProfile({ addresses: updated });
    setShowAddressForm(false);
    setNewAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = (user?.addresses || []).filter((a) => a.id !== id);
    await updateProfile({ addresses: updated });
    showToast('Address removed', 'info');
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updated = (user?.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await updateProfile({ addresses: updated });
    showToast('Default shipping address updated', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors">
      {/* Account Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
            Maison Vault
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Client ID: {user?.id} · {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs font-mono uppercase tracking-wider text-rose-500 hover:text-rose-400 self-start md:self-auto inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-1 text-xs font-mono uppercase">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-3.5 flex items-center justify-between border transition-colors ${
              activeTab === 'orders'
                ? 'border-neutral-900 dark:border-amber-400 bg-neutral-900 dark:bg-amber-400/10 text-white dark:text-amber-400 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Orders Archive</span>
            </div>
            <span className="tabular-nums font-bold">({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left p-3.5 flex items-center justify-between border transition-colors ${
              activeTab === 'wishlist'
                ? 'border-neutral-900 dark:border-amber-400 bg-neutral-900 dark:bg-amber-400/10 text-white dark:text-amber-400 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>Saved Silhouettes</span>
            </div>
            <span className="tabular-nums font-bold">({wishlistIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left p-3.5 flex items-center justify-between border transition-colors ${
              activeTab === 'addresses'
                ? 'border-neutral-900 dark:border-amber-400 bg-neutral-900 dark:bg-amber-400/10 text-white dark:text-amber-400 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </div>
            <span className="tabular-nums font-bold">({user?.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left p-3.5 flex items-center justify-between border transition-colors ${
              activeTab === 'profile'
                ? 'border-neutral-900 dark:border-amber-400 bg-neutral-900 dark:bg-amber-400/10 text-white dark:text-amber-400 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Profile & Security</span>
            </div>
          </button>
        </aside>

        {/* Content Area (9 cols) */}
        <main className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Client Orders & Tracking
              </h2>

              {isLoadingOrders ? (
                <div className="p-8 text-center text-xs text-neutral-400 font-mono">
                  Loading order history...
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 mb-4 font-mono">
                    No orders placed under this client account yet.
                  </p>
                  <button
                    onClick={() => onSelectProduct('')}
                    className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Start Streetwear Rotation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Order {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-mono uppercase font-semibold border ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                : ord.status === 'shipped'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          Placed: {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-12 h-14 bg-neutral-900 shrink-0 border border-neutral-300 dark:border-neutral-800 overflow-hidden">
                              <ProductImage
                                src={item.image}
                                alt={item.name}
                                aspectRatio="3:4"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-xs">
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-neutral-500 font-mono text-[11px]">
                                Size: {item.size} · Qty: {item.quantity} · {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                        <div className="text-neutral-500">
                          Total: <strong className="text-neutral-900 dark:text-amber-400 font-bold tabular-nums">{formatPrice(ord.total)}</strong>
                        </div>
                        <div className="text-amber-500 font-semibold">
                          Airway Bill: {ord.trackingNumber}
                        </div>
                      </div>

                      {/* Order timeline notes */}
                      {ord.timeline && ord.timeline.length > 0 && (
                        <div className="pt-2 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 dark:border-neutral-800/60">
                          Latest Note: {ord.timeline[ord.timeline.length - 1].note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Saved Silhouettes ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 mb-4 font-mono">
                    You haven't saved any garments to your archive wishlist yet.
                  </p>
                  <button
                    onClick={() => onSelectProduct('')}
                    className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Explore Garments
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3"
                    >
                      <div
                        onClick={() => onSelectProduct(p.slug || p.id)}
                        className="w-full aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer"
                      >
                        <ProductImage
                          src={p.images[0]}
                          alt={p.name}
                          aspectRatio="4:3"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-500 font-semibold block">
                          {p.categoryLabel}
                        </span>
                        <h4
                          onClick={() => onSelectProduct(p.slug || p.id)}
                          className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:text-amber-500 cursor-pointer transition-colors line-clamp-1"
                        >
                          {p.name}
                        </h4>
                        <span className="text-xs font-mono font-bold tabular-nums text-neutral-900 dark:text-amber-400 block mt-1">
                          {formatPrice(p.price)}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name, 1)}
                          className="flex-1 py-2 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-amber-300 transition-colors"
                        >
                          Move To Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="p-2 border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-rose-500 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Saved Delivery Addresses
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              </div>

              {/* Add form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
                >
                  <h3 className="font-bebas text-lg uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    New Shipping Destination
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-xs font-mono">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="accent-amber-400"
                    />
                    <label htmlFor="isDefault" className="text-neutral-600 dark:text-neutral-300 cursor-pointer">
                      Set as primary default address
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-xs font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-400 text-neutral-950 text-xs font-mono uppercase font-bold hover:bg-amber-300"
                    >
                      Save Destination
                    </button>
                  </div>
                </form>
              )}

              {/* Address list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user?.addresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono text-amber-500 font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/30">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {addr.street}
                        {addr.apartment && `, ${addr.apartment}`}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-xs text-neutral-500 font-mono mt-2">
                        Phone: {addr.phone}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-amber-500 hover:underline uppercase text-[11px]"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">Primary</span>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-400 hover:text-rose-500 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6">
              <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Personal Credentials & Security
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-3 text-xs font-body">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-400 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Password Change Sub-section */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                    <span className="block text-[11px] font-mono uppercase text-amber-500 font-semibold">
                      Change Security Password (Optional)
                    </span>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                        New Password (minimum 6 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-8 py-3 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Update Credentials'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
