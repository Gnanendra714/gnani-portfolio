import mongoose, { Schema, Document } from "mongoose";

export interface ISkillsSection extends Document {
  kicker: string;
  headline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillsSectionSchema = new Schema<ISkillsSection>(
  {
    kicker: {
      type: String,
      required: true,
      trim: true,
      default: "TECHNICAL ARSENAL",
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      default: "Engineering Competencies & Protocols",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
    },
  },
  {
    collection: "skills_section",
    timestamps: true,
  },
);

export const SkillsSectionModel =
  mongoose.models.SkillsSection ||
  mongoose.model<ISkillsSection>("SkillsSection", SkillsSectionSchema);
