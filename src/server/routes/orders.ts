import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin, optionalAuth, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { OrderStatus, PaymentStatus } from '../../types/index.js';

const router = Router();

// Create new order
router.post('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discount = 0,
      shippingCost = 0,
      total,
      appliedCoupon,
      paymentMethod = 'stripe',
      paymentStatus = 'paid',
      paymentId,
    } = req.body;

    if (!items || !items.length || !shippingAddress || !customerEmail || !customerName) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const userId = req.user ? req.user.id : undefined;

    const newOrder = db.createOrder({
      userId,
      customerEmail,
      customerName,
      customerPhone: customerPhone || shippingAddress.phone || '',
      shippingAddress,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shippingCost: Number(shippingCost),
      total: Number(total),
      appliedCoupon,
      status: 'processing',
      paymentMethod,
      paymentStatus: (paymentStatus as PaymentStatus) || 'paid',
      paymentId: paymentId || `pay_sim_${Date.now()}`,
      trackingNumber: `NX-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
    });

    return res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: 'Failed to process order' });
  }
});

// GET user orders
router.get('/my-orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userOrders = db.getOrdersByUserId(req.user!.id);
  return res.json({ orders: userOrders });
});

// GET single order by ID or orderNumber
router.get('/:idOrOrderNumber', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.idOrOrderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json({ order });
});

// ADMIN: Update order status
router.put('/:id/status', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = db.updateOrderStatus(req.params.id, status as OrderStatus, note);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json({ message: 'Order status updated', order: updated });
});

export default router;
