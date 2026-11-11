import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillItem {
  name: string;
  level: string;
  highlight?: boolean;
  desc?: string;
}

export interface ISkillCategory extends Document {
  id: string;
  name: string;
  iconName: string;
  order: number;
  skills: ISkillItem[];
  updatedAt: Date;
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    iconName: { type: String, default: 'Cpu' },
    order: { type: Number, default: 0 },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String, default: 'Proficient' },
        highlight: { type: Boolean, default: false },
        desc: { type: String, default: '' },
      },
    ],
  },
  { collection: 'skills', timestamps: true }
);

export const SkillModel = mongoose.models.Skill || mongoose.model<ISkillCategory>('Skill', SkillCategorySchema);
