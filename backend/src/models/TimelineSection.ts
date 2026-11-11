import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineSection extends Document {
  kicker: string;
  headline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineSectionSchema = new Schema<ITimelineSection>(
  {
    kicker: {
      type: String,
      required: true,
      trim: true,
      default: "CAREER & EDUCATION",
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      default: "Engineering Journey & Milestones",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "The progressive path from first circuit prototypes to enterprise web platforms and IoT systems.",
    },
  },
  {
    collection: "timeline_section",
    timestamps: true,
  },
);

export const TimelineSectionModel =
  mongoose.models.TimelineSection ||
  mongoose.model<ITimelineSection>("TimelineSection", TimelineSectionSchema);
