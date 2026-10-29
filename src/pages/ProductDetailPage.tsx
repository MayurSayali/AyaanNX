import React, { useState, useEffect } from 'react';
import { Heart, ShieldCheck, Truck, RefreshCw, Ruler, Check, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { Product, ProductSize } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useToast } from '../components/ui/Toast.js';
import { ProductImage } from '../components/ui/ProductImage.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { ReviewSection } from '../components/product/ReviewSection.js';
import { formatPrice } from '../utils/currency.js';

interface ProductDetailPageProps {
  slugOrId: string;
  products: Product[];
  onSelectProduct: (slugOrId: string) => void;
  onNavigateCheckout: () => void;
  onOpenSizeGuide: () => void;
  onRequireAuth: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slugOrId,
  products,
  onSelectProduct,
  onNavigateCheckout,
  onOpenSizeGuide,
  onRequireAuth,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'shipping' | 'sizing' | null>('fabric');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const fetchProduct = async () => {
    setLoading(true);
    let loadedFromApi = false;
    const fallbackProduct = products.find(
      (item) => item.id === slugOrId || item.slug === slugOrId
    );
    try {
      const res = await fetch(`/api/products/${slugOrId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setRelatedProducts(data.related || []);
          if (data.product.sizes?.length) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colors?.length) {
            setSelectedColor(data.product.colors[0].name);
          }
          loadedFromApi = true;
        }
      }
    } catch (err) {
      console.warn('Product API unavailable; using the bundled product catalog.', err);
    } finally {
      if (!loadedFromApi && fallbackProduct) {
        setProduct(fallbackProduct);
        setRelatedProducts(
          products.filter(
            (item) =>
              item.category === fallbackProduct.category && item.id !== fallbackProduct.id
          ).slice(0, 4)
        );
        setSelectedSize(fallbackProduct.sizes[0] || 'M');
        setSelectedColor(fallbackProduct.colors[0]?.name || '');
      } else if (!loadedFromApi) {
        setProduct(null);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [slugOrId, products]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-800" />
          <div className="space-y-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-1/4" />
            <div className="h-8 bg-neutral-300 dark:bg-neutral-700 w-3/4" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 w-1/3" />
            <div className="h-24 bg-neutral-100 dark:bg-neutral-800/50 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-bebas text-3xl tracking-wider text-neutral-400">SILHOUETTE NOT FOUND</h2>
        <p className="text-xs text-neutral-500 mt-2">The requested garment may have been archived or retired.</p>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showToast('This silhouette is currently sold out', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onNavigateCheckout();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mb-6 uppercase tracking-wider">
        <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer" onClick={() => onSelectProduct('')}>
          Shop
        </span>
        <span>/</span>
        <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">
          {product.categoryLabel}
        </span>
        <span>/</span>
        <span className="text-neutral-900 dark:text-neutral-200 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-y-auto max-h-[600px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 bg-neutral-900 shrink-0 border transition-all overflow-hidden ${
                    activeImageIndex === idx
                      ? 'border-amber-400 opacity-100 ring-1 ring-amber-400'
                      : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Visual Display */}
          <div className="flex-1 relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <ProductImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="4:3"
              className="w-full h-full object-cover"
            />

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 bg-neutral-900/60 hover:bg-neutral-900 text-white rounded-full backdrop-blur-sm transition-colors"
              title="Share silhouette"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sticky Purchase Module (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="sticky top-24 space-y-6">
            {/* Category & Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-500">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                <span className="text-amber-400">★ {product.rating.toFixed(1)}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-bebas text-3xl sm:text-4xl lg:text-5xl tracking-wide uppercase text-neutral-900 dark:text-neutral-100 leading-tight">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-2xl font-bold tabular-nums font-mono text-neutral-950 dark:text-amber-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm line-through text-neutral-400 tabular-nums font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-[11px] text-neutral-500 font-mono ml-auto">
                Tax calculated at checkout
              </span>
            </div>

            {/* Color Swatch Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-neutral-600 dark:text-neutral-400 uppercase font-semibold">
                  Colorway: <strong className="text-neutral-900 dark:text-white">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`group relative p-1 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-transparent hover:border-neutral-400'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-5 h-5 rounded-full block border border-neutral-400/40"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Size Guide trigger */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-neutral-600 dark:text-neutral-400 uppercase font-semibold">
                  Select Size
                </span>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Fit & Sizing Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-mono font-medium border transition-colors ${
                      selectedSize === size
                        ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock indicator */}
            <div className="text-xs font-mono flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              <span className="text-neutral-600 dark:text-neutral-300">
                {product.stock > 10
                  ? 'In Stock — Ships within 24 hours'
                  : product.stock > 0
                  ? `Only ${product.stock} units remaining in studio archive`
                  : 'Currently sold out'}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Add To Shopping Bag
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`p-4 border transition-colors flex items-center justify-center ${
                    isSaved
                      ? 'border-amber-400 bg-amber-400/10 text-amber-500'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full py-3.5 bg-neutral-900 hover:bg-black dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-semibold text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                Instant Checkout
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 font-mono">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Complimentary Delivery over ₹3,999</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>14-Day Vault Exchange</span>
              </div>
            </div>

            {/* Garment Details Accordion */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
              {/* Fabric & Specs */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono"
                >
                  <span>Fabrication & Construction</span>
                  {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'fabric' && (
                  <div className="pb-4 text-xs text-neutral-600 dark:text-neutral-300 space-y-2 font-body">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      <li>Weight: {product.fabric}</li>
                      <li>Fit: {product.fit}</li>
                      {product.features?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono"
                >
                  <span>Shipping & Customs</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-xs text-neutral-600 dark:text-neutral-300 space-y-2 font-body">
                    <p>
                      All Ayaan NX orders are carefully wrapped in embossed tissue and packed inside custom matte-black presentation boxes.
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500">
                      Standard Transit: 3–5 Business Days. Express Airway Courier: 1–2 Business Days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20">
        <ReviewSection
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={product.reviews}
          onReviewAdded={fetchProduct}
          onRequireAuth={onRequireAuth}
        />
      </div>

      {/* Related Silhouettes Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
              Coordinated Rotation
            </span>
            <h3 className="font-bebas text-3xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Related Silhouettes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
