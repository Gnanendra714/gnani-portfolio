import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  visitorId?: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    visitorId: { type: String, default: '', index: true },
    status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread', index: true },
  },
  { collection: 'messages', timestamps: true }
);

export const MessageModel = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
