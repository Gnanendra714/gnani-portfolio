import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  visitorId: string;
  name: string;
  firstVisit: Date;
  lastVisit: Date;
  visitCount: number;
  userAgent?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, default: 'Anonymous Visitor' },
    firstVisit: { type: Date, default: Date.now },
    lastVisit: { type: Date, default: Date.now },
    visitCount: { type: Number, default: 1, min: 1 },
    userAgent: { type: String, default: '' },
    referrer: { type: String, default: '' },
  },
  { collection: 'visitors', timestamps: true }
);

export const VisitorModel = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);
