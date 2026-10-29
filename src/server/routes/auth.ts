import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken, AuthenticatedRequest, JWT_SECRET } from '../middleware/authMiddleware.js';

const router = Router();

// Register new customer
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = db.createUser({
      name,
      email,
      passwordHash,
      phone: phone || '',
      role: 'customer',
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Google Login Simulator / One-click Auth
router.post('/google', async (req, res: Response) => {
  try {
    const { email, name, avatar } = req.body;
    const userEmail = email || 'sahil@example.com';
    const userName = name || 'Google Verified User';

    let user = db.getUserByEmail(userEmail);
    if (!user) {
      const generatedPasswordHash = await bcrypt.hash(Math.random().toString(), 10);
      const created = db.createUser({
        name: userName,
        email: userEmail,
        passwordHash: generatedPasswordHash,
        role: 'customer',
      });
      user = db.getUserById(created.id);
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to authenticate via Google' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      message: 'Authenticated via Google',
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // For security reasons, don't reveal non-existent email
    return res.json({ message: 'If that email exists, password reset instructions have been sent.' });
  }

  // Simulate token generation
  return res.json({
    message: 'Password reset link sent to your email. (Demo test link simulated: use reset code RESET-9921)',
    resetCode: 'RESET-9921',
  });
});

// Reset Password
router.post('/reset-password', async (req, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Valid email and new password (min 6 chars) required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  db.updateUser(user.id, { passwordHash: newHash });

  return res.json({ message: 'Password has been reset successfully. Please log in with your new password.' });
});

// Get Current User Profile
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Update Profile & Addresses
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, addresses, newPassword, currentPassword } = req.body;
    const user = db.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (addresses) updates.addresses = addresses;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = db.updateUser(user.id, updates);
    return res.json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
