import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, Plus, Edit2, Trash2, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../components/ui/Toast.js';
import { Product, Order, OrderStatus } from '../types/index.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { formatPrice } from '../utils/currency.js';

interface AdminPageProps {
  products: Product[];
  onRefreshProducts: () => void;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onRefreshProducts,
  onNavigateHome,
}) => {
  const { user, isAdmin, token } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Product Add / Edit Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 120,
    originalPrice: 150,
    description: '',
    fabric: '520 GSM French Terry Cotton',
    fit: 'Boxy Drop-Shoulder',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
  });

  const fetchAdminData = async () => {
    if (!token || !isAdmin) return;
    setIsLoading(true);
    try {
      const [overviewRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setOverviewMetrics(data.metrics);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setAdminOrders(data.orders || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setAdminUsers(data.users || []);
      }
    } catch (err) {
      console.error('Admin data fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-bebas text-3xl uppercase tracking-wider text-rose-500 mb-2">
          ADMIN CLEARANCE REQUIRED
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          You must be logged in as an administrator (e.g. admin@ayaannx.com) to access the studio control panel.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, note: `Status updated by Admin ${user?.name}` }),
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}`, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Error updating order', 'error');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        showToast('Inventory level synchronized', 'success');
        onRefreshProducts();
      }
    } catch {
      showToast('Error updating stock', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Archive this silhouette from the active catalog?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Product removed from active catalog', 'info');
        onRefreshProducts();
      }
    } catch {
      showToast('Error deleting product', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        categoryLabel: productForm.categoryLabel,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        description: productForm.description,
        fabric: productForm.fabric,
        fit: productForm.fit,
        stock: Number(productForm.stock),
        images: [productForm.imageUrl],
        isNewArrival: productForm.isNewArrival,
        isBestSeller: productForm.isBestSeller,
        isFeatured: productForm.isFeatured,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingProduct ? 'Product updated' : 'New product created', 'success');
        setShowProductModal(false);
        setEditingProduct(null);
        onRefreshProducts();
      }
    } catch {
      showToast('Failed to save product', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'hoodies',
      categoryLabel: 'Hoodies',
      price: 135,
      originalPrice: 165,
      description: 'Heavyweight custom French terry streetwear silhouette.',
      fabric: '520 GSM 100% Organic French Terry',
      fit: 'Boxy Drop-Shoulder',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      isNewArrival: true,
      isBestSeller: false,
      isFeatured: true,
    });
    setShowProductModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel,
      price: p.price,
      originalPrice: p.originalPrice || p.price + 30,
      description: p.description,
      fabric: p.fabric,
      fit: p.fit,
      stock: p.stock,
      imageUrl: p.images[0] || '',
      isNewArrival: Boolean(p.isNewArrival),
      isBestSeller: Boolean(p.isBestSeller),
      isFeatured: Boolean(p.isFeatured),
    });
    setShowProductModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
            Maison Headquarters
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            Ayaan NX Command Center
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Logged in as Superadmin: {user?.name} ({user?.email})
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Silhouette
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-8 overflow-x-auto text-xs font-mono uppercase">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'border-amber-400 text-amber-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${
            activeTab === 'products'
              ? 'border-amber-400 text-amber-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Products & Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'border-amber-400 text-amber-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Orders Fulfillment ({adminOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${
            activeTab === 'users'
              ? 'border-amber-400 text-amber-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Client Accounts ({adminUsers.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                Total Net Revenue
              </span>
              <span className="font-bebas text-4xl text-amber-500">
                {formatPrice(overviewMetrics?.totalRevenue ?? 45990)}
              </span>
              <div className="text-[10px] text-neutral-500 font-mono mt-2">
                Processed via Stripe & Razorpay
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                Dispatched Orders
              </span>
              <span className="font-bebas text-4xl text-neutral-900 dark:text-neutral-100">
                {overviewMetrics?.totalOrders || adminOrders.length}
              </span>
              <div className="text-[10px] text-neutral-500 font-mono mt-2">100% On-time FedEx delivery</div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                Catalog Silhouettes
              </span>
              <span className="font-bebas text-4xl text-neutral-900 dark:text-neutral-100">
                {products.length}
              </span>
              <div className="text-[10px] text-neutral-500 font-mono mt-2">5 Active Collections</div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                Registered Clients
              </span>
              <span className="font-bebas text-4xl text-neutral-900 dark:text-neutral-100">
                {adminUsers.length || 2}
              </span>
              <div className="text-[10px] text-neutral-500 font-mono mt-2">Active VIP rotation</div>
            </div>
          </div>

          {/* Low Stock Watch */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Low Stock Atelier Warning
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products
                .filter((p) => p.stock <= 18)
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="p-4 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                    <div className="w-12 h-14 bg-neutral-900 shrink-0 border border-neutral-800">
                      <ProductImage src={p.images[0]} alt={p.name} aspectRatio="3:4" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.name}</div>
                      <div className="text-rose-500 font-mono text-[11px] font-bold">Only {p.stock} units left</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-xs tabular-nums border-collapse">
              <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-mono text-neutral-500 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Silhouette</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950 font-body">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-900 shrink-0 border border-neutral-800 overflow-hidden">
                        <ProductImage src={p.images[0]} alt={p.name} aspectRatio="3:4" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{p.fit}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500 uppercase">{p.categoryLabel}</td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-amber-400">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        <input
                          type="number"
                          defaultValue={p.stock}
                          min={0}
                          onBlur={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                          className="w-16 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs text-neutral-900 dark:text-neutral-100 text-center"
                        />
                        <span className="text-[10px] text-neutral-400">units</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500">★ {p.rating.toFixed(1)} ({p.reviewCount})</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-500 hover:text-amber-500"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {adminOrders.map((ord) => (
            <div key={ord.id} className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                    Order {ord.orderNumber}
                  </span>
                  <span className="text-neutral-400 font-mono text-xs ml-3">Client: {ord.customerName} ({ord.customerEmail})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-amber-500 tabular-nums">
                    Total: {formatPrice(ord.total)}
                  </span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs font-mono uppercase text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block mb-1">Shipping Destination:</span>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Airway & Courier:</span>
                  <p className="text-neutral-700 dark:text-neutral-300">{ord.trackingNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div className="border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-xs tabular-nums border-collapse">
            <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-mono text-neutral-500 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950 font-mono">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">{u.name}</td>
                  <td className="py-3 px-4 text-neutral-500">{u.email}</td>
                  <td className="py-3 px-4 uppercase text-amber-500 font-bold">{u.role}</td>
                  <td className="py-3 px-4">{u.ordersCount || 0}</td>
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-amber-400">{formatPrice(u.totalSpent || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 text-neutral-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-white mb-4">
              {editingProduct ? 'Edit Silhouette' : 'Add New Streetwear Silhouette'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-body">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value, categoryLabel: e.target.value.toUpperCase() })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white uppercase font-mono"
                  >
                    <option value="baggy-jeans">Baggy Jeans</option>
                    <option value="shirts">Shirts</option>
                    <option value="linen">Pure Linen</option>
                    <option value="ladies-wear">Ladies Wear</option>
                    <option value="traditional">Traditional & Ethnic</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Graphic Tees</option>
                    <option value="cargo-pants">Cargos</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Fabric Weight</label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 hover:text-white text-xs uppercase font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 text-neutral-950 font-bold uppercase hover:bg-amber-300 text-xs font-mono"
                >
                  Save Silhouette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
