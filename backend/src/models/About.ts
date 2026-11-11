import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  kicker: string;
  headline: string;
  intro: string;
  workflowTitle: string;
  workflowSubtitle: string;
  workflowSteps: {
    step: string;
    title: string;
    desc: string;
  }[];
  pillars: {
    id: string;
    title: string;
    icon: string;
    subtitle: string;
    description: string;
    summary: string;
    details: string[];
    footerTag?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    specialization: string;
    year: string;
    status: string;
    highlights: string[];
  };
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    kicker: {
      type: String,
      default: "ABOUT ME",
    },
    headline: {
      type: String,
      default: "The Mind Behind the Machine",
    },
    intro: {
      type: String,
      default: "",
    },

    workflowTitle: {
      type: String,
      default: "The Cyber-Physical Workflow",
    },
    workflowSubtitle: {
      type: String,
      default:
        "Bridging the gap between raw hardware signals and cloud software",
    },

    workflowSteps: [
      {
        step: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],

    pillars: [
      {
        id: { type: String, default: "" },
        title: { type: String, default: "" },
        icon: { type: String, default: "Cpu" },

        // Fields used by the About CMS and public AboutSection.
        subtitle: { type: String, default: "" },
        description: { type: String, default: "" },

        // Legacy fields retained for existing portfolio content.
        summary: { type: String, default: "" },
        details: { type: [String], default: [] },
        footerTag: { type: String },
      },
    ],

    education: {
      degree: {
        type: String,
        default: "Bachelor of Technology (B.Tech)",
      },
      institution: {
        type: String,
        default: "Electronics & Communication Engineering",
      },
      specialization: {
        type: String,
        default: "Embedded Systems & IoT Specialization",
      },
      year: {
        type: String,
        default: "2023 - 2026",
      },
      status: {
        type: String,
        default: "Final Year Active",
      },
      highlights: {
        type: [String],
        default: [],
      },
    },
  },
  {
    collection: "abouts",
    timestamps: true,
  },
);

export const AboutModel =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
