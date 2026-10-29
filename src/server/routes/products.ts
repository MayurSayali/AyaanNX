import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { ProductSize, ProductCategory } from '../../types/index.js';

const router = Router();

// GET all products with dynamic filtering and sorting
router.get('/', (req: Request, res: Response) => {
  try {
    let products = db.getProducts();

    const {
      category,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      search,
      featured,
      newArrival,
      bestseller,
    } = req.query;

    // Filter by search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    // Filter by size
    if (size && typeof size === 'string' && size !== 'all') {
      products = products.filter((p) => p.sizes.includes(size as ProductSize));
    }

    // Filter by color
    if (color && typeof color === 'string' && color !== 'all') {
      products = products.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(color.toLowerCase()))
      );
    }

    // Filter by price range
    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Flag filters
    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }
    if (newArrival === 'true') {
      products = products.filter((p) => p.isNewArrival);
    }
    if (bestseller === 'true') {
      products = products.filter((p) => p.isBestSeller);
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'bestselling':
        default:
          products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
      }
    }

    return res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// GET live search autocomplete suggestions
router.get('/search/suggestions', (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.trim().length === 0) {
    return res.json({ suggestions: [] });
  }

  const query = q.toLowerCase().trim();
  const products = db.getProducts();

  const matching = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    )
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images[0],
      categoryLabel: p.categoryLabel,
      rating: p.rating,
      stock: p.stock,
    }));

  return res.json({ suggestions: matching });
});

// GET single product by ID or slug
router.get('/:idOrSlug', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Also include 3 related products from same category
  const related = db
    .getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return res.json({ product, related });
});

// POST user review on product
router.post('/:id/reviews', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  if (!comment || comment.trim().length < 5) {
    return res.status(400).json({ error: 'Comment must be at least 5 characters long' });
  }

  const updatedProduct = db.addReview(productId, {
    userId: req.user!.id,
    userName: req.user!.name || 'Verified Buyer',
    rating: Number(rating),
    comment: comment.trim(),
    verifiedPurchase: true,
  });

  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.status(201).json({
    message: 'Review posted successfully',
    product: updatedProduct,
  });
});

// ADMIN: Create Product
router.post('/', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const {
    name,
    category,
    categoryLabel,
    price,
    originalPrice,
    description,
    features,
    fabric,
    fit,
    sizes,
    colors,
    images,
    stock,
    isNewArrival,
    isBestSeller,
    isFeatured,
    tags,
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newProd = db.createProduct({
    name,
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    category: category as ProductCategory,
    categoryLabel: categoryLabel || category.charAt(0).toUpperCase() + category.slice(1),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    description: description || '',
    features: features || [],
    fabric: fabric || '100% Premium Cotton',
    fit: fit || 'Signature Relaxed Fit',
    sizes: sizes || ['S', 'M', 'L', 'XL'],
    colors: colors || [{ name: 'Matte Black', hex: '#111111' }],
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'],
    stock: stock ? Number(stock) : 20,
    isNewArrival: Boolean(isNewArrival),
    isBestSeller: Boolean(isBestSeller),
    isFeatured: Boolean(isFeatured),
    tags: tags || ['Streetwear', 'New'],
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
  });

  return res.status(201).json({ message: 'Product created successfully', product: newProd });
});

// ADMIN: Update Product
router.put('/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ message: 'Product updated successfully', product: updated });
});

// ADMIN: Delete Product
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ message: 'Product deleted successfully' });
});

export default router;
