import mongoose, { Schema, Document } from 'mongoose';

export interface IHero extends Document {
  name: string;
  fullName: string;
  roleTag: string;
  roles: string[];
  shortBio: string;
  extendedBio: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  youtube: string;
  availableForHire: boolean;
  mcuBoard: string;
  mcuClock: string;
  mcuBaud: string;
  stats: {
    label: string;
    value: string;
    note: string;
  }[];
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    name: { type: String, required: true, default: 'Gnani' },
    fullName: { type: String, required: true, default: 'Gnanendra' },
    roleTag: { type: String, default: 'ELECTRONICS & EMBEDDED SYSTEMS ENGINEER' },
    roles: { type: [String], default: ['Arduino & ESP32 Developer', 'Full Stack Web Engineer', 'IoT Solutions Creator', 'AI Integration Enthusiast'] },
    shortBio: { type: String, required: true },
    extendedBio: { type: String },
    email: { type: String, default: 'gnanendra714@gmail.com' },
    location: { type: String, default: 'India' },
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
    youtube: { type: String, default: 'https://youtube.com' },
    availableForHire: { type: Boolean, default: true },
    mcuBoard: { type: String, default: 'ESP32-WROOM-32D' },
    mcuClock: { type: String, default: '240MHz' },
    mcuBaud: { type: String, default: 'UART 115200' },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        note: { type: String, default: '' },
      },
    ],
  },
  { collection: 'heroes', timestamps: true }
);

export const HeroModel = mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);
