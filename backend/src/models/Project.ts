import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  category: 'Embedded & IoT' | 'AI & Web' | 'Internships' | string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  highlights: string[];
  architecture?: string[];
  metrics?: { label: string; value: string }[];
  featured: boolean;
  published: boolean;
  order: number;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true, default: 'Embedded & IoT' },
    badge: { type: String, default: 'Engineering Deliverable' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    githubUrl: { type: String, default: 'https://github.com' },
    liveUrl: { type: String, default: '#' },
    highlights: { type: [String], default: [] },
    architecture: { type: [String], default: [] },
    metrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    featured: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { collection: 'projects', timestamps: true }
);

export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
