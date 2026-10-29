import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { ProductImage } from '../ui/ProductImage.js';
import { formatPrice } from '../../utils/currency.js';

interface QuickCartDrawerProps {
  onNavigateCheckout: () => void;
  onNavigateCart: () => void;
  onContinueShopping: () => void;
}

export const QuickCartDrawer: React.FC<QuickCartDrawerProps> = ({
  onNavigateCheckout,
  onNavigateCart,
  onContinueShopping,
}) => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    progressToFreeShipping,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setIsApplying(true);
    await applyCoupon(couponCode);
    setIsApplying(false);
    setCouponCode('');
  };

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="font-bebas text-xl tracking-wider uppercase text-neutral-100">
                Shopping Bag
              </span>
              <span className="text-xs text-neutral-400 font-mono">({items.length} items)</span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-neutral-950/80 border-b border-neutral-800/80">
            <div className="flex items-center justify-between text-xs text-neutral-300 mb-1.5">
              <span>
                {amountNeeded === 0
                  ? '🎉 Free Expedited Shipping unlocked!'
                  : `Add ${formatPrice(amountNeeded)} more for Free Shipping`}
              </span>
              <span className="tabular-nums font-mono text-[11px] text-amber-400">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="font-bebas text-3xl tracking-widest text-neutral-600 mb-2">
                  BAG IS EMPTY
                </span>
                <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                  Your luxury streetwear rotation begins with our latest heavyweight silhouettes.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-neutral-100 text-neutral-950 font-medium text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-20 h-24 bg-neutral-800 shrink-0 border border-neutral-800 overflow-hidden">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                        <span>Size: <strong className="text-neutral-200">{item.size}</strong></span>
                        <span>·</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-neutral-700/80 bg-neutral-950/60 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono tabular-nums text-neutral-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold tabular-nums text-neutral-100 font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-neutral-800 p-6 bg-neutral-950/70 space-y-4">
              {/* Promo code form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-medium">{appliedCoupon.code} applied (-{formatPrice(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. AYAAN10)"
                    className="flex-1 bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-mono text-neutral-200">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount</span>
                    <span className="tabular-nums font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums font-mono text-neutral-200">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm font-semibold text-neutral-100">
                  <span>Total</span>
                  <span className="tabular-nums font-mono text-amber-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    closeDrawer();
                    onNavigateCheckout();
                  }}
                  className="w-full py-3 bg-amber-400 text-neutral-950 font-bold text-xs tracking-widest uppercase hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Checkout Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeDrawer();
                    onNavigateCart();
                  }}
                  className="w-full py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors text-center"
                >
                  View Full Bag
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Encrypted 256-Bit Checkout · 14-Day Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
