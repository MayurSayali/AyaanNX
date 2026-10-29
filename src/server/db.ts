import bcrypt from 'bcryptjs';
import { Product, Order, User, Coupon, ProductReview } from '../types/index.js';

// Pre-hashed password for demo accounts ("password123")
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const initialCoupons: Coupon[] = [
  {
    code: 'AYAAN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2999,
    description: '10% off on all streetwear orders over ₹2,999',
  },
  {
    code: 'STREET20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 7999,
    maxDiscount: 2500,
    description: '20% off on luxury drops over ₹7,999',
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 250,
    minOrderAmount: 3999,
    description: 'Free priority courier delivery across India',
  },
];

import { initialProducts } from './catalog.js';
export { initialProducts };

export const initialUsers: (User & { passwordHash: string })[] = [
  {
    id: 'usr-admin',
    name: 'Ayaan Khan',
    email: 'admin@ayaannx.com',
    role: 'admin',
    passwordHash: DEMO_PASSWORD_HASH,
    phone: '+91 98200 12345',
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'Ayaan Khan (Atelier)',
        phone: '+91 98200 12345',
        street: 'Ayaan NX Atelier, 42 Linking Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
        isDefault: true,
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-customer-1',
    name: 'Sahil Gangad',
    email: 'sahil@example.com',
    role: 'customer',
    passwordHash: DEMO_PASSWORD_HASH,
    phone: '+91 98765 43210',
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Sahil Gangad',
        phone: '+91 98765 43210',
        street: '42 Linking Road, Bandra West',
        apartment: 'Flat 402',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
        isDefault: true,
      },
      {
        id: 'addr-cust-2',
        fullName: 'Sahil Gangad (Studio)',
        phone: '+91 98765 43210',
        street: '100 Feet Road, Indiranagar',
        apartment: 'Suite 3B',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        isDefault: false,
      },
    ],
    createdAt: '2026-02-14T10:00:00Z',
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'NX-89210',
    userId: 'usr-customer-1',
    customerEmail: 'sahil@example.com',
    customerName: 'Sahil Gangad',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Sahil Gangad',
      phone: '+91 98765 43210',
      street: '42 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      isDefault: true,
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Bombay Vintage Washed Wide-Leg Baggy Jeans',
        price: 3499,
        quantity: 1,
        size: 'L',
        color: 'Vintage Acid Wash',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'prod-3',
        name: 'Bandra Boxy Cuban Collar Printed Shirt',
        price: 2499,
        quantity: 1,
        size: 'L',
        color: 'Ivory & Gold Arch',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 5998,
    discount: 599.8,
    shippingCost: 0,
    total: 5398.2,
    appliedCoupon: 'AYAAN10',
    status: 'shipped',
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    paymentId: 'pi_test_3N8x791aLmq9023x',
    trackingNumber: 'NX-FEDEX-99201419',
    createdAt: '2026-10-10T14:32:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2026-10-10T14:32:00Z',
        note: 'Order payment verified via Stripe test mode.',
      },
      {
        status: 'processing',
        timestamp: '2026-10-11T09:15:00Z',
        note: 'Packaged in Ayaan NX embossed matte black luxury box in Mumbai atelier.',
      },
      {
        status: 'shipped',
        timestamp: '2026-10-12T11:45:00Z',
        note: 'Dispatched via FedEx Priority courier. Airway bill #NX-FEDEX-99201419.',
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'NX-89211',
    userId: 'usr-customer-1',
    customerEmail: 'sahil@example.com',
    customerName: 'Sahil Gangad',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Sahil Gangad',
      phone: '+91 98765 43210',
      street: '42 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      isDefault: true,
    },
    items: [
      {
        productId: 'prod-12',
        name: 'Royal Matka Silk Bandhgala Jodhpuri Set',
        price: 9999,
        quantity: 1,
        size: 'L',
        color: 'Royal Midnight Black',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 9999,
    discount: 0,
    shippingCost: 0,
    total: 9999,
    status: 'processing',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    paymentId: 'pay_test_Rz91082Kln',
    createdAt: '2026-10-14T17:10:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2026-10-14T17:10:00Z',
        note: 'Payment authorized via Razorpay test gateway.',
      },
      {
        status: 'processing',
        timestamp: '2026-10-15T08:30:00Z',
        note: 'Royal silk finishing and crest button fitting in progress.',
      },
    ],
  },
];

// In-Memory Database store with write helpers
class Database {
  products: Product[] = [...initialProducts];
  users: (User & { passwordHash: string })[] = [...initialUsers];
  orders: Order[] = [...initialOrders];
  coupons: Coupon[] = [...initialCoupons];

  // Product methods
  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id || p.slug === id);
  }

  createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 0,
      reviews: data.reviews || [],
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  addReview(productId: string, review: Omit<ProductReview, 'id' | 'date'>): Product | null {
    const product = this.getProductById(productId);
    if (!product) return null;

    const newReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    const currentReviews = product.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

    return this.updateProduct(product.id, {
      reviews: updatedReviews,
      reviewCount: updatedReviews.length,
      rating: avgRating,
    });
  }

  // User methods
  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: { name: string; email: string; passwordHash: string; role?: 'customer' | 'admin'; phone?: string }): User {
    const newUser: User & { passwordHash: string } = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role || 'customer',
      passwordHash: data.passwordHash,
      phone: data.phone || '',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id: string, updates: Partial<User & { passwordHash?: string }>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    const { passwordHash: _, ...safeUser } = this.users[idx];
    return safeUser;
  }

  // Order methods
  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Order {
    const orderNumber = `NX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: orderData.status || 'pending',
          timestamp: new Date().toISOString(),
          note: `Order ${orderNumber} placed successfully via ${orderData.paymentMethod.toUpperCase()}.`,
        },
      ],
    };

    // Deduct stock for ordered products
    for (const item of orderData.items) {
      const prod = this.getProductById(item.productId);
      if (prod && prod.stock >= item.quantity) {
        this.updateProduct(prod.id, { stock: prod.stock - item.quantity });
      }
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status'], note?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status}.`,
    });

    return order;
  }

  // Coupon methods
  getCoupon(code: string): Coupon | undefined {
    return this.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  }
}

export const db = new Database();
