import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard Overview Metrics
router.get('/overview', (req: AuthenticatedRequest, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const users = db.users;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 15);

  const categorySalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      categorySalesMap[item.name] = (categorySalesMap[item.name] || 0) + item.quantity;
    });
  });

  return res.json({
    metrics: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: users.filter((u) => u.role === 'customer').length,
      lowStockCount: lowStockProducts.length,
    },
    recentOrders: orders.slice(0, 8),
    lowStockItems: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      price: p.price,
      image: p.images[0],
    })),
  });
});

// Get all orders for admin
router.get('/orders', (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;
  let orders = db.getOrders();

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status === status);
  }

  return res.json({ orders });
});

// Get all users
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const users = db.users.map(({ passwordHash: _, ...safeUser }) => {
    const userOrders = db.getOrdersByUserId(safeUser.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      ...safeUser,
      ordersCount: userOrders.length,
      totalSpent: Number(totalSpent.toFixed(2)),
    };
  });

  return res.json({ users });
});

// Quick update stock
router.put('/inventory/:id', (req: AuthenticatedRequest, res: Response) => {
  const { stock } = req.body;
  if (stock === undefined || isNaN(Number(stock))) {
    return res.status(400).json({ error: 'Valid stock number required' });
  }

  const updated = db.updateProduct(req.params.id, { stock: Math.max(0, Number(stock)) });
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json({ message: 'Stock updated', product: updated });
});

export default router;
