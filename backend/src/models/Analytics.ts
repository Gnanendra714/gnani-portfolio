import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  devices: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  topReferrers: {
    source: string;
    count: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: { type: String, required: true, unique: true, index: true },
    views: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    devices: {
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
      desktop: { type: Number, default: 0 },
    },
    topReferrers: [
      {
        source: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { collection: 'analytics', timestamps: true }
);

export const AnalyticsModel = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
