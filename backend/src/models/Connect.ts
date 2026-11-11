import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectChannel {
  id: string;
  name: string;
  icon: string;
  handle: string;
  description: string;
  url: string;
  actionLabel?: string;
  order: number;
}

export interface IConnect extends Document {
  kicker: string;
  headline: string;
  description: string;
  formTitle: string;
  formSubtitle: string;
  email: string;
  location: string;
  channels: IConnectChannel[];
  updatedAt: Date;
}

const ConnectSchema = new Schema<IConnect>(
  {
    kicker: { type: String, default: 'GET IN TOUCH' },
    headline: { type: String, default: "Let's Connect and Build Together" },
    description: { type: String, default: 'Always open to discussing embedded systems, IoT architecture, or full-stack opportunities.' },
    formTitle: { type: String, default: 'Send a Direct Message' },
    formSubtitle: { type: String, default: 'Reach out directly for internships, collaborations, or hardware discussions.' },
    email: { type: String, default: 'gnanendra714@gmail.com' },
    location: { type: String, default: 'India' },
    channels: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, default: 'Mail' },
        handle: { type: String, required: true },
        description: { type: String, default: '' },
        url: { type: String, required: true },
        actionLabel: { type: String, default: 'Open' },
        order: { type: Number, default: 0 },
      },
    ],
  },
  { collection: 'connects', timestamps: true }
);

export const ConnectModel = mongoose.models.Connect || mongoose.model<IConnect>('Connect', ConnectSchema);
