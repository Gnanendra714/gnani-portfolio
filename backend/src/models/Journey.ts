import mongoose, { Schema, Document } from 'mongoose';

export interface IJourneyMilestone extends Document {
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  story: string;
  technologies: string[];
  achievements: string[];
  order: number;
  published: boolean;
  updatedAt: Date;
}

const JourneySchema = new Schema<IJourneyMilestone>(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    summary: { type: String, required: true },
    story: { type: String, required: true },
    technologies: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { collection: 'journeys', timestamps: true }
);

export const JourneyModel = mongoose.models.Journey || mongoose.model<IJourneyMilestone>('Journey', JourneySchema);
