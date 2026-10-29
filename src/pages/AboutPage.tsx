import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';
import { ProductImage } from '../components/ui/ProductImage.js';

interface AboutPageProps {
  onNavigateShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop }) => {
  return (
    <div className="w-full flex flex-col transition-colors">
      {/* Manifesto Hero */}
      <section className="relative w-full py-24 bg-neutral-950 text-neutral-100 overflow-hidden border-b border-neutral-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-3">
            Atelier Manifesto
          </span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-wide uppercase text-white mb-6 leading-none">
            REJECTING TRANSIENCE. <br />
            MILLING ARCHIVAL PERMANENCE.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed font-body">
            Ayaan NX was established in 2026 to dismantle the cycle of lightweight, disposable streetwear. We engineer brutalist, architectural garments built around custom 520 GSM French terry cotton and precision utility tailoring.
          </p>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-4">
            <span className="font-mono text-xs font-bold text-amber-500 uppercase">Pillar I</span>
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              520 GSM Custom French Terry
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              Spun from 100% organic long-staple combed cotton. The fabric maintains its structured, architectural silhouette wash after wash, rejecting drawstrings for an uncompromising minimalist profile.
            </p>
          </div>

          <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-4">
            <span className="font-mono text-xs font-bold text-amber-500 uppercase">Pillar II</span>
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Utilitarian Pleating
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              Our trousers feature deep inverted front pleats, hidden German Fidlock magnetic cargo pocket flaps, and bungee cinch hems to stack impeccably over sneakers or combat boots.
            </p>
          </div>

          <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-4">
            <span className="font-mono text-xs font-bold text-amber-500 uppercase">Pillar III</span>
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Cold Pigment Archive Dye
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              Every garment undergoes a multi-stage mineral cold garment-dye bath. Subtle tonal high-and-low shades emerge along the seams, creating an authentic vintage luxury archive patina.
            </p>
          </div>
        </div>
      </section>

      {/* Studio Locations */}
      <section className="bg-neutral-50 dark:bg-neutral-950/60 py-20 border-t border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold">
                Heart of Indian Fashion
              </span>
              <h2 className="font-bebas text-4xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Flagship Atelier · Mumbai
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                Our flagship design atelier and fitting salon operates out of Bandra West, Mumbai. We collaborate directly with master artisans across Gujarat, Lucknow, Kerala, and Rajasthan, weaving generational handcrafts with modern relaxed silhouettes tailored for the discerning Indian wardrobe.
              </p>
              <div className="pt-4">
                <button
                  onClick={onNavigateShop}
                  className="px-8 py-3 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
                >
                  Shop Current Rotation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full aspect-[4/3] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <ProductImage
                src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80"
                alt="Ayaan NX Design Studio"
                aspectRatio="4:3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
