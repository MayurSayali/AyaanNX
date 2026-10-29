import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Truck } from 'lucide-react';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { ProductImage } from '../components/ui/ProductImage.js';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (slugOrId: string) => void;
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onNavigate,
}) => {
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Campaign Banner */}
      <section className="relative w-full min-h-[82vh] flex items-center justify-center bg-neutral-950 text-neutral-100 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <ProductImage
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1920&q=80"
            alt="Ayaan NX Luxury Streetwear Campaign"
            aspectRatio="16:9"
            className="w-full h-full object-cover filter brightness-45 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/50 to-neutral-950" />
        </div>

        {/* Hero Content (Clean typographic hierarchy) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-[11px] font-mono tracking-widest uppercase text-amber-400">
            <span>Bandra Atelier Series</span>
            <span>/</span>
            <span>Crafted for Modern India</span>
          </div>

          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white mb-6 uppercase leading-none max-w-4xl">
            RELAXED BAGGY DENIM. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-200 to-amber-500">
              AIRY LINEN. ROYAL COUTURE.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-body leading-relaxed mb-10 font-normal">
            Bespoke Indian fashion engineered for modern comfort. 14.5oz vintage wide-leg baggy jeans, breathable pure Malabar linen shirts, Banarasi brocade ladies co-ords, and Lucknowi hand-embroidered kurtas.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02]"
            >
              Shop Indian Collections
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('shop', 'baggy-jeans')}
              className="w-full sm:w-auto px-8 py-4 border border-neutral-600 hover:border-neutral-300 bg-neutral-900/60 backdrop-blur-md text-neutral-100 font-semibold text-xs uppercase tracking-widest transition-all duration-200"
            >
              Explore Baggy Jeans
            </button>
          </div>
        </div>

        {/* Bottom Strip Trust Metrics */}
        <div className="absolute bottom-0 inset-x-0 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-4 gap-4 text-center divide-x divide-neutral-900 text-xs text-neutral-400 font-mono uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Flagship Atelier · Mumbai</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Pan-India Priority Courier</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>14-Day Complimentary Exchange</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Direct Master Artisans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Taxonomy Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
              Curated Taxonomy
            </span>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
              Indian Fashion Pillars
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs uppercase font-medium tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors inline-flex items-center gap-1.5 mt-2 md:mt-0"
          >
            Browse All Categories
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Baggy Jeans & Denim */}
          <div
            onClick={() => onNavigate('shop', 'baggy-jeans')}
            className="group relative h-96 overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800"
          >
            <ProductImage
              src="/images/categories/baggy-jeans.jpg"
              alt="Baggy Jeans & Denim"
              aspectRatio="3:4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Pillar 01
                </span>
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">
                  Baggy Jeans & Denim
                </h3>
                <p className="text-xs text-neutral-300 font-body">14.5oz rigid wide-leg slouch, skater wash</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-500 flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-neutral-950 group-hover:border-amber-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Pure Linen & Resort Shirts */}
          <div
            onClick={() => onNavigate('shop', 'linen')}
            className="group relative h-96 overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800"
          >
            <ProductImage
              src="/images/categories/linen-shirts.jpg"
              alt="Pure Linen Clothes & Shirts"
              aspectRatio="3:4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Pillar 02
                </span>
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">
                  Pure Linen & Shirts
                </h3>
                <p className="text-xs text-neutral-300 font-body">Malabar flax kurta-shirts, Cuban resort collars</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-500 flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-neutral-950 group-hover:border-amber-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Ladies Wear & Traditional */}
          <div
            onClick={() => onNavigate('shop', 'ladies-wear')}
            className="group relative h-96 overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800"
          >
            <ProductImage
              src="/images/categories/ladies-wear.jpg"
              alt="Ladies Wear & Festive Traditional"
              aspectRatio="3:4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Pillar 03
                </span>
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">
                  Ladies Wear & Ethnic
                </h3>
                <p className="text-xs text-neutral-300 font-body">Banarasi zari co-ords, Royal bandhgalas</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-neutral-500 flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-neutral-950 group-hover:border-amber-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950/50 py-20 border-y border-neutral-200 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
                Fresh From Studio
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase font-medium tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors inline-flex items-center gap-1.5 mt-2 md:mt-0"
            >
              View All ({products.length} Garments)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Craftsmanship & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold">
              The Architecture of Indian Craft
            </span>
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide uppercase text-neutral-900 dark:text-neutral-100 leading-tight">
              Rooted in Mumbai. <br />
              Woven for Modern India.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
              Ayaan NX bridges heritage Indian master handlooms with relaxed streetwear cuts. From custom 14.5oz rigid denim tailored in Bandra to pure Malabar flax linens, Lucknowi chikankari needlework, and Banarasi zari brocades—crafted for our climate and contemporary style.
            </p>
            <div className="space-y-3 pt-2 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-amber-400" />
                <span>100% Breathable pure European flax linen & organic Indian cotton.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-amber-400" />
                <span>Handcrafted by generational artisans across Gujarat, Lucknow & Mumbai.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-amber-400" />
                <span>Modern anti-shrink washes tested for tropical Indian climates.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-400 dark:hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
              >
                Read Our Story
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="w-full aspect-[4/3] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
              <ProductImage
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                alt="Ayaan NX Mumbai Atelier Craftsmanship"
                aspectRatio="4:3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-neutral-950 border border-neutral-800 p-4 text-xs font-mono text-neutral-300 shadow-xl hidden sm:block">
              <span className="text-amber-400 font-bold block mb-1">BANDRA WEST ATELIER</span>
              <span>MUMBAI, MAHARASHTRA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="bg-neutral-100/60 dark:bg-neutral-900/40 py-20 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
                Global Rotation
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
                Most Wanted Silhouettes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase font-medium tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors inline-flex items-center gap-1.5 mt-2 md:mt-0"
            >
              View Shop
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
