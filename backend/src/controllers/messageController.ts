import { Request, Response } from 'express';
import { MessageModel } from '../models/Message.js';
import { isDbConnected } from '../config/db.js';

const memoryMessages: any[] = [];

/**
 * Public: Submit a contact message from the portfolio
 */
export async function createMessage(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, subject, message, visitorId } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, error: 'Full name is required' });
      return;
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'Valid email address is required' });
      return;
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      res.status(400).json({ success: false, error: 'Subject is required' });
      return;
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.status(400).json({ success: false, error: 'Message content must be at least 5 characters long' });
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      visitorId: visitorId || '',
      status: 'unread',
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      // Check for accidental duplicate within the last 60 seconds
      const oneMinuteAgo = new Date(Date.now() - 60000);
      const duplicate = await MessageModel.findOne({
        email: payload.email,
        message: payload.message,
        createdAt: { $gte: oneMinuteAgo },
      });

      if (duplicate) {
        res.status(409).json({
          success: false,
          error: 'Duplicate message detected. Please wait a moment before sending again.',
        });
        return;
      }

      const doc = await MessageModel.create(payload);
      res.status(201).json({
        success: true,
        message: 'Message delivered to Gnani successfully! You will receive a reply shortly.',
        data: doc,
      });
      return;
    }

    // In-memory fallback
    const memDoc = { id: `msg_${Date.now()}`, ...payload };
    memoryMessages.unshift(memDoc);
    res.status(201).json({
      success: true,
      message: 'Message received by Gnani successfully! You will receive a reply shortly.',
      data: memDoc,
    });
  } catch (error: any) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

/**
 * Admin: Get messages with search, filter (all / unread / read / archived), and pagination
 */
export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const status = req.query.status as string; // 'unread' | 'read' | 'all'
    const search = (req.query.search as string || '').trim();
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
        ];
      }

      const [totalCount, unreadCount, messages] = await Promise.all([
        MessageModel.countDocuments(query),
        MessageModel.countDocuments({ status: 'unread' }),
        MessageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ]);

      res.json({
        success: true,
        unreadCount,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalCount,
        },
        messages,
      });
      return;
    }

    // Fallback
    let filtered = memoryMessages;
    if (status && status !== 'all') {
      filtered = filtered.filter((m) => m.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    const unreadCount = memoryMessages.filter((m) => m.status === 'unread').length;

    res.json({
      success: true,
      unreadCount,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
        totalCount: filtered.length,
      },
      messages: filtered.slice(skip, skip + limit),
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

/**
 * Admin: Mark a message as read or update status
 */
export async function updateMessageStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status = 'read' } = req.body;

    if (isDbConnected()) {
      const updated = await MessageModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updated) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      res.json({ success: true, message: 'Message updated', data: updated });
      return;
    }

    const item = memoryMessages.find((m) => m.id === id || m._id === id);
    if (item) {
      item.status = status;
      res.json({ success: true, message: 'Message updated', data: item });
      return;
    }

    res.status(404).json({ success: false, error: 'Message not found' });
  } catch (error: any) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

/**
 * Admin: Delete a message
 */
export async function deleteMessage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await MessageModel.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      res.json({ success: true, message: 'Message deleted successfully' });
      return;
    }

    const idx = memoryMessages.findIndex((m) => m.id === id || m._id === id);
    if (idx !== -1) {
      memoryMessages.splice(idx, 1);
      res.json({ success: true, message: 'Message deleted successfully' });
      return;
    }

    res.status(404).json({ success: false, error: 'Message not found' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
