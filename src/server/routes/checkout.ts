import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// Validate and apply coupon code
router.post('/apply-coupon', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  const coupon = db.getCoupon(code);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid coupon code. Try AYAAN10 or STREET20.' });
  }

  if (subtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      error: `Minimum order amount for ${coupon.code} is ₹${coupon.minOrderAmount.toLocaleString('en-IN')}`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);
  discount = Number(discount.toFixed(2));

  return res.json({
    valid: true,
    code: coupon.code,
    discount,
    description: coupon.description,
  });
});

// Create Payment Intent (Stripe & Razorpay test mode simulations)
router.post('/create-payment-intent', (req: Request, res: Response) => {
  const { amount, currency = 'INR', paymentMethod = 'stripe' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid payment amount required' });
  }

  if (paymentMethod === 'stripe') {
    // Return Stripe test mode mock client secret & config
    return res.json({
      success: true,
      provider: 'stripe',
      clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      testCardNote: 'Use Stripe Test Card: 4242 •••• •••• 4242 with any future date and CVC.',
      amount,
      currency: 'INR',
    });
  } else if (paymentMethod === 'razorpay') {
    // Return Razorpay test order ID
    return res.json({
      success: true,
      provider: 'razorpay',
      orderId: `order_test_${Date.now()}`,
      currency: 'INR',
      amountInPaise: Math.round(amount * 100), // amount is in INR, paise = amount * 100
      keyId: 'rzp_test_AyaanNxStreetwearDemo',
      notes: 'Razorpay Sandbox Mode: Simulated instant approval in INR',
    });
  } else {
    // Cash on Delivery
    return res.json({
      success: true,
      provider: 'cod',
      message: 'Cash on Delivery verified for domestic dispatch.',
    });
  }
});

export default router;
