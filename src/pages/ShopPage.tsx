import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { ProductCardSkeleton } from '../components/ui/Skeleton.js';
import { formatPrice } from '../utils/currency.js';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (slugOrId: string) => void;
  isLoading?: boolean;
}

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Collections' },
  { id: 'baggy-jeans', label: 'Baggy Jeans & Denim' },
  { id: 'shirts', label: 'Oversized & Resort Shirts' },
  { id: 'linen', label: 'Pure Linen Clothes' },
  { id: 'ladies-wear', label: 'Ladies Wear & Indo-Western' },
  { id: 'traditional', label: 'Traditional & Ethnic Wear' },
  { id: 'hoodies', label: 'Heavyweight Hoodies' },
  { id: 'tees', label: 'Graphic Tees' },
  { id: 'accessories', label: 'Accessories' },
];

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Indigo', hex: '#1B2430' },
  { name: 'Black', hex: '#111111' },
  { name: 'Bone', hex: '#EAE6DF' },
  { name: 'Emerald', hex: '#0F5132' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Beige', hex: '#D2B48C' },
  { name: 'Sage', hex: '#8A9A86' },
];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory,
  initialSearch,
  onSelectProduct,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<string>('bestselling');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync initial props
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(15000);
    setSearchQuery('');
    setSortBy('bestselling');
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Size
    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize as ProductSize));
    }

    // Color
    if (selectedColor !== 'all') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    // Price
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'bestselling':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSize, selectedColor, maxPrice, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 15000 ||
    Boolean(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
            Studio Catalog
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            {selectedCategory === 'all'
              ? 'Complete Streetwear Rotation'
              : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </h1>
          {searchQuery && (
            <p className="text-xs text-neutral-500 mt-1">
              Showing results for "<strong className="text-neutral-900 dark:text-neutral-200">{searchQuery}</strong>"
            </p>
          )}
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-neutral-300 dark:border-neutral-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {hasActiveFilters && '•'}
          </button>

          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="hidden sm:inline font-mono uppercase text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="bestselling">Most Popular</option>
              <option value="newest">Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-8`}>
          {/* Active Filter Clear Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-amber-500 hover:text-amber-400 font-mono inline-flex items-center gap-1 uppercase"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-500 mb-3 font-semibold">
              Category
            </h4>
            <div className="space-y-1 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left py-1.5 px-2 transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-amber-400 font-semibold dark:bg-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-500 mb-3 font-semibold">
              Garment Size
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`py-2 text-xs font-mono uppercase border transition-colors ${
                  selectedSize === 'all'
                    ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                }`}
              >
                All
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-xs font-mono uppercase border transition-colors ${
                    selectedSize === size
                      ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-500 mb-3 font-semibold">
              Tone & Colorway
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                  selectedColor === 'all'
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                All
              </button>
              {COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  className={`px-3 py-1.5 text-xs font-mono border flex items-center gap-1.5 transition-colors ${
                    selectedColor === col.name
                      ? 'border-amber-400 text-amber-500 font-semibold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-neutral-400/40"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="uppercase text-neutral-500 font-semibold">Max Price</span>
              <span className="text-neutral-900 dark:text-amber-400 font-bold tabular-nums">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
              <span>₹2,000</span>
              <span>₹15,000</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area (3 Cols) */}
        <main className="lg:col-span-3">
          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-6 flex-wrap text-xs text-neutral-500">
              <span>Active filters:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono hover:text-rose-400"
                >
                  {selectedCategory} <X className="w-3 h-3" />
                </button>
              )}
              {selectedSize !== 'all' && (
                <button
                  onClick={() => setSelectedSize('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono hover:text-rose-400"
                >
                  Size: {selectedSize} <X className="w-3 h-3" />
                </button>
              )}
              {selectedColor !== 'all' && (
                <button
                  onClick={() => setSelectedColor('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono hover:text-rose-400"
                >
                  Color: {selectedColor} <X className="w-3 h-3" />
                </button>
              )}
              {maxPrice < 15000 && (
                <button
                  onClick={() => setMaxPrice(15000)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono hover:text-rose-400"
                >
                  Under {formatPrice(maxPrice)} <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono hover:text-rose-400"
                >
                  "{searchQuery}" <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-800 p-8">
              <span className="font-bebas text-3xl tracking-widest text-neutral-400 dark:text-neutral-600 block mb-2">
                NO PIECES MATCH CRITERIA
              </span>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                Adjust or clear your size, category, and price filters to view the full Ayaan NX rotation.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 dark:hover:bg-amber-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
