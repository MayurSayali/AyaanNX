import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product, ProductSize } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ProductImage } from '../ui/ProductImage.js';
import { formatPrice } from '../../utils/currency.js';

interface ProductCardProps {
  product: Product;
  onSelect: (slugOrId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickAdding(true);
    addToCart(product, selectedSize, product.colors[0]?.name, 1);
    setTimeout(() => setIsQuickAdding(false), 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Determine single subtle badge
  const subtleBadge = product.isNewArrival
    ? 'New Drop'
    : product.isBestSeller
    ? 'Bestseller'
    : product.stock <= 10
    ? `Only ${product.stock} Left`
    : null;

  return (
    <div
      onClick={() => onSelect(product.slug || product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-md"
    >
      {/* Visual Image Container */}
      <div className="relative w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          aspectRatio="4:3"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Subtle Text Tag (Zero-Pill discipline: unboxed text badge) */}
        {subtleBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] tracking-wider uppercase font-mono font-semibold px-2 py-0.5 bg-neutral-950/90 text-amber-400 border border-amber-500/30">
              {subtleBadge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isSaved
              ? 'bg-amber-400 text-neutral-950'
              : 'bg-black/40 text-white hover:bg-black/70 hover:text-amber-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-neutral-950/90 via-neutral-950/70 to-transparent transition-opacity duration-200 flex flex-col gap-2 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:flex'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick size selector */}
          <div className="flex items-center justify-center gap-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] font-mono px-2 py-0.5 border transition-colors ${
                  selectedSize === s
                    ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                    : 'border-neutral-700 bg-neutral-900/90 text-neutral-300 hover:border-neutral-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quick Add CTA */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="w-full py-2 bg-neutral-100 hover:bg-amber-400 text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            {isQuickAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-neutral-950" />
                <span>Added ({selectedSize})</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Metadata (Lead with clean typography) */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 font-mono">
            <span>{product.categoryLabel}</span>
            <span className="tabular-nums">★ {product.rating.toFixed(1)}</span>
          </div>

          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tabular-nums font-mono text-neutral-950 dark:text-amber-400">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-neutral-400 tabular-nums font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color palette indicator */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-neutral-400/40"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-neutral-400 font-mono">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
