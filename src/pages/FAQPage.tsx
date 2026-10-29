import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: 'shipping' | 'sizing' | 'returns' | 'care' | 'payment';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'sizing',
    q: 'How do Ayaan NX garments fit compared to standard sizes?',
    a: 'Ayaan NX silhouettes feature an authentic boxy drop-shoulder cut with generous chest measurements and structured shoulders. We advise selecting your standard size for the intended relaxed drape, or sizing down one size for a tailored streetwear fit.',
  },
  {
    category: 'sizing',
    q: 'What is 520 GSM French Terry Cotton?',
    a: 'GSM stands for grams per square meter. Standard fast-fashion fleece is typically 220–280 GSM. Our custom 520 GSM French terry is more than double the weight, providing unmatched architectural structure, warmth, and resilience that maintains its shape over years of wear.',
  },
  {
    category: 'shipping',
    q: 'How long does domestic and international delivery take?',
    a: 'All orders are processed and boxed in our studio within 24–48 hours. Domestic courier transit takes 2–4 business days via FedEx Priority. International deliveries take 4–7 business days with all customs and import duties fully calculated at checkout.',
  },
  {
    category: 'shipping',
    q: 'Is shipping free?',
    a: 'Yes, we provide complimentary expedited courier shipping across India on all orders over ₹3,999. For orders under ₹3,999, a flat ₹250 priority courier fee applies.',
  },
  {
    category: 'payment',
    q: 'What payment gateways and test methods are supported?',
    a: 'We accept all major credit cards via Stripe (Visa, Mastercard, Amex), UPI and Netbanking via Razorpay, and Cash on Delivery (COD) for domestic destinations.',
  },
  {
    category: 'returns',
    q: 'What is your vault return and exchange policy?',
    a: 'We offer a 14-day complimentary exchange window from the date of package delivery. Items must remain unwashed and unworn with original luxury presentation tags attached.',
  },
  {
    category: 'care',
    q: 'How should I wash and care for heavyweight pigment-dyed cotton?',
    a: 'Wash inside out in cold water on a delicate cycle using gentle detergent. Hang dry or flat dry in the shade to preserve the deep pigment patina. Never tumble dry heavyweight French terry.',
  },
];

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full transition-colors">
      <div className="text-center mb-10">
        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-2">
          Knowledge Base
        </span>
        <h1 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2 font-body">
          Everything you need to know about fabric weights, sizing guidance, worldwide courier transit, and order care.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. 520 GSM, shipping, returns)..."
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 pl-10 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap font-mono text-xs uppercase">
        {['all', 'sizing', 'shipping', 'payment', 'returns', 'care'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 border transition-colors ${
              activeCategory === cat
                ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400 font-mono">
            No matching questions found for "{search}".
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-2 group"
                >
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
