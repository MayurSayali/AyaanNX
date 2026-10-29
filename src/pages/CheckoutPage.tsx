import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../components/ui/Toast.js';
import { PaymentMethod, Order } from '../types/index.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { formatPrice } from '../utils/currency.js';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateCart: () => void;
  onNavigateAuth: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onNavigateCart,
  onNavigateAuth,
}) => {
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Contact & Shipping Form
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Razorpay simulation state
  const [razorpayUpiId, setRazorpayUpiId] = useState('ayaan.nx@okhdfcbank');

  const [isProcessing, setIsProcessing] = useState(false);

  // Autofill if user has saved addresses
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.name || '');
      setPhone(user.phone || '');
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setStreet(defaultAddr.street || '');
        setApartment(defaultAddr.apartment || '');
        setCity(defaultAddr.city || '');
        setState(defaultAddr.state || '');
        setPostalCode(defaultAddr.postalCode || '');
        setCountry(defaultAddr.country || 'India');
      }
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-bebas text-3xl uppercase text-neutral-400">NO ITEMS FOR CHECKOUT</h2>
        <p className="text-xs text-neutral-500 mt-2">Your shopping bag is currently empty.</p>
        <button
          onClick={onNavigateCart}
          className="mt-6 px-6 py-2.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider"
        >
          Return to Bag
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !fullName || !street || !city || !postalCode) {
      showToast('Please complete all required shipping fields', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Simulate Payment Intent creation with backend
      const intentRes = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          paymentMethod,
        }),
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        throw new Error(intentData.error || 'Payment gateway failed');
      }

      // Simulate network verification delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Step 2: Post Order to Server
      const token = localStorage.getItem('ayaan_token');
      const orderPayload = {
        customerEmail: email,
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          phone,
          street,
          apartment,
          city,
          state,
          postalCode,
          country,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        subtotal,
        discount,
        shippingCost: shippingFee,
        total,
        appliedCoupon: appliedCoupon?.code,
        paymentMethod,
        paymentStatus: 'paid',
        paymentId: intentData.clientSecret || intentData.orderId || `cod_ref_${Date.now()}`,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to register order');
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#111111', '#EAE6DF'],
        });
      } catch {}

      clearCart();
      showToast('Payment verified! Order placed successfully.', 'success');
      onOrderSuccess(orderData.order);
    } catch (err: any) {
      showToast(err.message || 'Payment processing error', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8 flex items-center justify-between">
        <button
          onClick={onNavigateCart}
          className="text-xs font-mono uppercase text-neutral-500 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Bag
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>SSL 256-Bit Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Form (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* Customer identification */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                1. Contact Information
              </h2>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={onNavigateAuth}
                  className="text-xs font-mono text-amber-500 hover:underline uppercase"
                >
                  Log In for Express Checkout
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              2. Shipping Destination
            </h2>

            <div className="space-y-3 text-xs font-body">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sahil Gangad"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="42 Linking Road, Bandra West"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                    Apartment / Suite
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Flat 402"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400050"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              3. Payment Method (Test Sandbox)
            </h2>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`py-3 px-3 text-xs font-mono uppercase font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-500'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Stripe Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`py-3 px-3 text-xs font-mono uppercase font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-500'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span className="font-bold text-xs tracking-wider">RAZORPAY</span>
                <span>UPI / Netbanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3 px-3 text-xs font-mono uppercase font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-500'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span className="font-bold text-xs">C.O.D.</span>
                <span>Pay on Arrival</span>
              </button>
            </div>

            {/* Stripe Card Container */}
            {paymentMethod === 'stripe' && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>Stripe Sandbox Simulation</span>
                  <span className="text-amber-500 font-semibold">Test Mode Active</span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 font-mono pt-1">
                  ✓ Pre-filled with Stripe test credentials for instant sandbox authorization.
                </p>
              </div>
            )}

            {/* Razorpay Simulation */}
            {paymentMethod === 'razorpay' && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>Razorpay Sandbox Gateway</span>
                  <span className="text-amber-500 font-semibold">Test Mode</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    value={razorpayUpiId}
                    onChange={(e) => setRazorpayUpiId(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-2.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  ✓ Razorpay test gateway authorized in Indian Rupees (₹) for simulated instant approval.
                </p>
              </div>
            )}

            {/* COD Details */}
            {paymentMethod === 'cod' && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 space-y-2 font-mono">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Cash on Delivery Verified
                </p>
                <p>
                  You will pay {formatPrice(total)} directly to the FedEx priority courier upon inspection and delivery.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing {paymentMethod.toUpperCase()} Vault...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order ({formatPrice(total)})</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right: Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              Order Details ({items.length} Items)
            </h3>

            {/* Thumbnail list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800/80 pr-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="pt-3 flex gap-3 items-center">
                  <div className="w-14 h-16 bg-neutral-800 shrink-0 border border-neutral-300 dark:border-neutral-800 overflow-hidden">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-neutral-500 font-mono text-[11px]">
                      {item.size} · {item.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold tabular-nums text-neutral-900 dark:text-amber-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-mono text-neutral-900 dark:text-neutral-200 font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-500 font-mono font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Expedited Courier</span>
                <span className="tabular-nums font-mono text-neutral-900 dark:text-neutral-200 font-semibold">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                <span>Total Due</span>
                <span className="tabular-nums font-mono text-amber-500">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Complimentary 14-day exchange guarantee</span>
              </div>
              <p>Each parcel includes an authentic Ayaan NX Certificate of Craftsmanship.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
