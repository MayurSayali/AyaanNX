import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
  onOpenSizeGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSizeGuide }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-neutral-950 text-neutral-300 border-t border-neutral-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-neutral-900">
          
          {/* Brand Vision (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-bebas text-3xl tracking-widest text-neutral-100 block">
              AYAAN NX
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-body">
              An independent Indian luxury fashion and streetwear label combining relaxed baggy denim, pure breathable linens, crafted resort shirts, contemporary ladies wear, and royal festive traditional attire.
            </p>
            <div className="text-[11px] text-amber-500 font-mono tracking-wider pt-2">
              FLAGSHIP ATELIER · BANDRA WEST · MUMBAI · INDIA
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100 mb-4 font-mono">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'baggy-jeans')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Baggy Jeans & Denim
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'shirts')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Oversized & Resort Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'linen')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pure Linen Clothes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'ladies-wear')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ladies Wear & Co-ords
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'traditional')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Traditional & Ethnic Couture
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100 mb-4 font-mono">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-amber-400 transition-colors"
                >
                  Garment Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account', 'orders')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Studio Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Atelier Story
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100 mb-4 font-mono">
              Archive Dispatch
            </h4>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Receive early access to seasonal capsule drops and private archive sales.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Enrolled in priority dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-300 transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  Strict zero-spam policy. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>© {new Date().getFullYear()} AYAAN NX MAISON. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => onNavigate('faq')} className="hover:text-neutral-300">
              Terms & Conditions
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-neutral-300">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-neutral-300">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
