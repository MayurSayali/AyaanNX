import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, ProductSize } from '../types/index.js';
import { useToast } from '../components/ui/Toast.js';

interface AppliedCouponInfo {
  code: string;
  discount: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product, size: ProductSize, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCouponInfo | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 3999;
const STANDARD_SHIPPING_FEE = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ayaan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponInfo | null>(() => {
    try {
      const saved = localStorage.getItem('ayaan_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('ayaan_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('ayaan_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('ayaan_coupon');
    }
  }, [appliedCoupon]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product: Product, size: ProductSize, color?: string, quantity = 1) => {
    const selectedColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && item.size === size && item.color === selectedColor
    );

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        showToast(`Only ${product.stock} units available in stock`, 'error');
        return;
      }
      updated[existingIndex].quantity = newQty;
      setItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${selectedColor}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color: selectedColor,
        quantity,
        stock: product.stock,
      };
      setItems((prev) => [...prev, newItem]);
    }

    showToast(`Added ${product.name} (${size}) to bag`, 'success');
    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from shopping bag', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (quantity > item.stock) {
            showToast(`Max stock reached (${item.stock})`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    if (appliedCoupon?.code === 'FREESHIP') return 0;
    return STANDARD_SHIPPING_FEE;
  }, [subtotal, appliedCoupon]);

  const progressToFreeShipping = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.code === 'FREESHIP') return 0;
    return appliedCoupon.discount;
  }, [appliedCoupon]);

  const total = useMemo(() => {
    const calculated = subtotal - discount + shippingFee;
    return Math.max(0, Number(calculated.toFixed(2)));
  }, [subtotal, discount, shippingFee]);

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/checkout/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Invalid promotional code', 'error');
        return false;
      }

      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        description: data.description,
      });

      showToast(`Coupon applied! ${data.description}`, 'success');
      return true;
    } catch {
      showToast('Error validating coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        progressToFreeShipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
