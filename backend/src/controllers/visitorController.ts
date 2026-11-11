import { Request, Response } from 'express';
import { VisitorModel } from '../models/Visitor.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback store when DB is offline
const memoryVisitors: Map<string, any> = new Map();

/**
 * Register a new visitor or update a returning visitor.
 * Called automatically from the public portfolio.
 */
export async function trackVisitor(req: Request, res: Response): Promise<void> {
  try {
    const { visitorId, name, referrer } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({ success: false, error: 'visitorId string is required' });
      return;
    }

    const cleanName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'Anonymous Visitor';
    const userAgent = req.headers['user-agent'] || '';

    if (isDbConnected()) {
      let visitor = await VisitorModel.findOne({ visitorId });

      if (visitor) {
        // Returning visitor
        visitor.visitCount += 1;
        visitor.lastVisit = new Date();
        if (cleanName !== 'Anonymous Visitor' && visitor.name === 'Anonymous Visitor') {
          visitor.name = cleanName;
        }
        await visitor.save();

        res.json({
          success: true,
          isNew: false,
          visitor: {
            visitorId: visitor.visitorId,
            name: visitor.name,
            visitCount: visitor.visitCount,
            lastVisit: visitor.lastVisit,
          },
        });
        return;
      }

      // First-time visitor
      visitor = await VisitorModel.create({
        visitorId,
        name: cleanName,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
        userAgent,
        referrer: referrer || '',
      });

      res.status(201).json({
        success: true,
        isNew: true,
        visitor: {
          visitorId: visitor.visitorId,
          name: visitor.name,
          visitCount: visitor.visitCount,
          firstVisit: visitor.firstVisit,
        },
      });
      return;
    }

    // In-Memory Fallback
    const existing = memoryVisitors.get(visitorId);
    if (existing) {
      existing.visitCount += 1;
      existing.lastVisit = new Date();
      if (cleanName !== 'Anonymous Visitor') {
        existing.name = cleanName;
      }
      res.json({ success: true, isNew: false, visitor: existing });
      return;
    }

    const newVisitor = {
      visitorId,
      name: cleanName,
      firstVisit: new Date(),
      lastVisit: new Date(),
      visitCount: 1,
      userAgent,
      referrer: referrer || '',
    };
    memoryVisitors.set(visitorId, newVisitor);
    res.status(201).json({ success: true, isNew: true, visitor: newVisitor });
  } catch (error: any) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

/**
 * Admin: Get all visitors with search, filter, and pagination
 */
export async function getVisitors(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const search = (req.query.search as string || '').trim();
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { visitorId: { $regex: search, $options: 'i' } },
        ];
      }

      const [totalCount, visitors, totalVisitsAgg, returningCount] = await Promise.all([
        VisitorModel.countDocuments(query),
        VisitorModel.find(query).sort({ lastVisit: -1 }).skip(skip).limit(limit).lean(),
        VisitorModel.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]),
        VisitorModel.countDocuments({ visitCount: { $gt: 1 } }),
      ]);

      const totalVisits = totalVisitsAgg[0]?.total || totalCount;
      const newVisitors = Math.max(0, totalCount - returningCount);

      res.json({
        success: true,
        stats: {
          totalVisitors: totalCount,
          newVisitors,
          returningVisitors: returningCount,
          totalVisits,
        },
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalCount,
        },
        visitors,
      });
      return;
    }

    // In-memory fallback
    const all = Array.from(memoryVisitors.values()).reverse();
    const filtered = search
      ? all.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.visitorId.includes(search))
      : all;
    const paginated = filtered.slice(skip, skip + limit);
    const returningCount = all.filter((v) => v.visitCount > 1).length;
    const totalVisits = all.reduce((sum, v) => sum + v.visitCount, 0);

    res.json({
      success: true,
      stats: {
        totalVisitors: all.length,
        newVisitors: all.length - returningCount,
        returningVisitors: returningCount,
        totalVisits,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
        totalCount: filtered.length,
      },
      visitors: paginated,
    });
  } catch (error: any) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
