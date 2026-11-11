import mongoose, { Schema, Document } from "mongoose";

export interface IProjectsSection extends Document {
  kicker: string;
  headline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectsSectionSchema = new Schema<IProjectsSection>(
  {
    kicker: {
      type: String,
      required: true,
      trim: true,
      default: "PORTFOLIO OF WORK",
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      default: "Signature Engineering Deliverables",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications.",
    },
  },
  {
    collection: "projects_section",
    timestamps: true,
  },
);

export const ProjectsSectionModel =
  mongoose.models.ProjectsSection ||
  mongoose.model<IProjectsSection>("ProjectsSection", ProjectsSectionSchema);
