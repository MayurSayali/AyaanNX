import React from 'react';
import { CheckCircle2, Truck, PackageCheck, Clock, ArrowRight, Printer, MapPin } from 'lucide-react';
import { Order } from '../types/index.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { formatPrice } from '../utils/currency.js';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onViewAccountOrders: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
  onViewAccountOrders,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full transition-colors">
      {/* Success Banner */}
      <div className="text-center pb-10 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="w-16 h-16 bg-amber-400/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block">
          Order Payment Verified
        </span>
        <h1 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          ORDER {order.orderNumber} CONFIRMED
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto font-body">
          We have dispatched a full confirmation receipt to <strong className="text-neutral-900 dark:text-neutral-200">{order.customerEmail}</strong>. Your luxury silhouettes are being prepared in our studio.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 text-neutral-700 dark:text-neutral-300 text-xs font-mono uppercase inline-flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="my-10 p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Fulfillment Journey
          </span>
          <span className="text-xs font-mono text-amber-500 font-bold">
            Airway Bill: {order.trackingNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center mb-2 font-bold shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
              Authorized
            </span>
            <span className="text-[10px] text-neutral-500 font-mono mt-0.5">Payment Verified</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center mb-2 font-bold shadow-md">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
              Atelier Boxing
            </span>
            <span className="text-[10px] text-neutral-500 font-mono mt-0.5">Quality Inspection</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-75">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mb-2 font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono">
              FedEx Transit
            </span>
            <span className="text-[10px] text-neutral-500 font-mono mt-0.5">Priority Airway</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-75">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mb-2 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono">
              Final Handover
            </span>
            <span className="text-[10px] text-neutral-500 font-mono mt-0.5">Signature Required</span>
          </div>
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {/* Shipping details */}
        <div className="p-6 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold mb-3">
            <MapPin className="w-4 h-4" />
            <span>Delivery Destination</span>
          </div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-body">
            {order.shippingAddress.street}
            {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-body">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-body">
            {order.shippingAddress.country}
          </p>
          <p className="text-xs text-neutral-500 font-mono pt-2">
            Phone: {order.shippingAddress.phone || order.customerPhone}
          </p>
        </div>

        {/* Payment info */}
        <div className="p-6 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <span className="text-xs font-mono uppercase text-amber-500 font-semibold block mb-3">
            Payment & Vault Details
          </span>
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Method</span>
            <span className="font-mono uppercase font-semibold text-neutral-900 dark:text-neutral-100">
              {order.paymentMethod} Gateway
            </span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Transaction Ref</span>
            <span className="font-mono text-neutral-900 dark:text-neutral-100 truncate max-w-[180px]">
              {order.paymentId}
            </span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Total Paid</span>
            <span className="font-mono font-bold text-amber-500">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Estimated Delivery</span>
            <span className="font-mono text-neutral-900 dark:text-neutral-100">
              3–5 Business Days
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Garments */}
      <div className="border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900/40">
        <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          Purchased Silhouettes
        </h3>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {order.items.map((item, i) => (
            <div key={i} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 bg-neutral-900 shrink-0 border border-neutral-300 dark:border-neutral-800 overflow-hidden">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="3:4"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold tabular-nums text-neutral-900 dark:text-amber-400">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
        >
          Explore More Pieces
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onViewAccountOrders}
          className="w-full sm:w-auto px-8 py-3.5 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 text-neutral-800 dark:text-neutral-200 font-semibold text-xs uppercase tracking-widest transition-colors"
        >
          View In Client Account
        </button>
      </div>
    </div>
  );
};
