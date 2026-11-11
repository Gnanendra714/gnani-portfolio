import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AdminModel } from '../models/Admin.js';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const admin = await AdminModel.findOne({ email: cleanEmail });

      if (!admin) {
        res.status(401).json({ success: false, error: 'Invalid admin credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid admin credentials' });
        return;
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken({
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        name: admin.name,
      });

      res.json({
        success: true,
        message: 'Authentication successful',
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
      return;
    }

    // Offline / local fallback validation (admin@gnani.dev / Admin@123)
    if (cleanEmail === 'admin@gnani.dev' && password === 'Admin@123') {
      const token = generateToken({
        id: 'local_admin_1',
        email: cleanEmail,
        role: 'superadmin',
        name: 'Gnani (Local Mode)',
      });

      res.json({
        success: true,
        message: 'Authentication successful (Local Fallback)',
        token,
        admin: {
          id: 'local_admin_1',
          email: cleanEmail,
          name: 'Gnani (Local Mode)',
          role: 'superadmin',
        },
      });
      return;
    }

    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    if (isDbConnected()) {
      const admin = await AdminModel.findById(req.user.id).select('-passwordHash').lean();
      if (!admin) {
        res.status(404).json({ success: false, error: 'Admin account not found' });
        return;
      }
      res.json({ success: true, admin });
      return;
    }

    res.json({
      success: true,
      admin: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error: any) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { name, email, currentPassword, newPassword } = req.body;

    if (isDbConnected()) {
      const admin = await AdminModel.findById(req.user.id);
      if (!admin) {
        res.status(404).json({ success: false, error: 'Admin account not found' });
        return;
      }

      if (name) admin.name = name.trim();
      if (email) admin.email = email.trim().toLowerCase();

      if (newPassword) {
        if (!currentPassword) {
          res.status(400).json({ success: false, error: 'Current password is required to change password' });
          return;
        }
        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch) {
          res.status(400).json({ success: false, error: 'Current password does not match' });
          return;
        }
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash(newPassword, salt);
      }

      await admin.save();
      res.json({
        success: true,
        message: 'Profile updated successfully',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated (in-memory mode)',
      admin: {
        id: req.user.id,
        name: name || req.user.name,
        email: email || req.user.email,
        role: req.user.role,
      },
    });
  } catch (error: any) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
