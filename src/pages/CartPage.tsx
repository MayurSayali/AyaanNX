import React, { useState } from 'react';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { formatPrice } from '../utils/currency.js';

interface CartPageProps {
  onNavigateCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (slugOrId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateCheckout,
  onContinueShopping,
  onSelectProduct,
}) => {
  const {
    items,
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

  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(promoCode);
    setIsApplying(false);
    setPromoCode('');
  };

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-4 border border-neutral-300 dark:border-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-bebas text-4xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100 mb-2">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-8 font-body">
          Explore our collection of custom 520 GSM French terry hoodies and technical cargo trousers.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Streetwear Silhouettes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full transition-colors">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
            Order Review
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            Shopping Bag ({items.length})
          </h1>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-xs font-mono uppercase text-neutral-500 hover:text-amber-500 transition-colors hidden sm:inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart items list (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Alert Banner */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300 mb-2 font-mono">
              <span>
                {amountNeeded === 0
                  ? '🎉 Complimentary Worldwide Shipping Unlocked!'
                  : `Add ${formatPrice(amountNeeded)} more for Free Shipping`}
              </span>
              <span className="text-amber-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Image */}
                <div
                  onClick={() => onSelectProduct(item.productId)}
                  className="w-24 h-32 bg-neutral-900 shrink-0 border border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="3:4"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <h3
                    onClick={() => onSelectProduct(item.productId)}
                    className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-amber-500 cursor-pointer transition-colors"
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                    <span>Size: <strong className="text-neutral-800 dark:text-neutral-200">{item.size}</strong></span>
                    <span>·</span>
                    <span>Color: <strong className="text-neutral-800 dark:text-neutral-200">{item.color}</strong></span>
                  </div>
                  <div className="text-xs text-neutral-500 font-mono pt-1">
                    Unit Price: <span className="tabular-nums text-neutral-800 dark:text-neutral-300 font-semibold">{formatPrice(item.price)}</span>
                  </div>
                </div>

                {/* Quantity & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-mono">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 tabular-nums text-neutral-900 dark:text-neutral-100 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-bold tabular-nums font-mono text-neutral-900 dark:text-amber-400 min-w-[70px] text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-neutral-400 hover:text-rose-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
            <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              Summary
            </h2>

            {/* Promo Code Form */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                Promo Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span className="font-mono font-bold">{appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AYAAN10"
                    className="flex-1 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 uppercase focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-200 hover:bg-neutral-800 text-xs font-mono uppercase font-semibold transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-mono font-semibold text-neutral-900 dark:text-neutral-200">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-500">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums font-mono font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="tabular-nums font-mono font-semibold text-neutral-900 dark:text-neutral-200">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-base font-bold text-neutral-900 dark:text-neutral-100">
                <span>Total</span>
                <span className="tabular-nums font-mono text-amber-500">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onNavigateCheckout}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Stripe & Razorpay Secure Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
