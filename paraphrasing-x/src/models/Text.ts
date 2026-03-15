import mongoose, { Schema, Document } from 'mongoose';

export interface IText extends Document {
  sessionId: string;
  originalText: string;
  paraphrasedText: string;
  mode: string;
  stats: {
    plagiarismBefore?: number;
    plagiarismAfter?: number;
    aiDetectionBefore?: number;
    aiDetectionAfter?: number;
    wordCount?: number;
    compressionRatio?: number;
    plagiarismScore?: number;
    sentenceCount?: number;
    avgSentenceLength?: number;
    detectionMethod?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TextSchema = new Schema<IText>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    paraphrasedText: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: 'academic',
    },
    stats: {
      plagiarismBefore: { type: Number, default: 0 },
      plagiarismAfter: { type: Number, default: 0 },
      aiDetectionBefore: { type: Number, default: 0 },
      aiDetectionAfter: { type: Number, default: 0 },
      wordCount: { type: Number, default: 0 },
      compressionRatio: { type: Number, default: 0 },
      plagiarismScore: { type: Number, default: 0 },
      sentenceCount: { type: Number, default: 0 },
      avgSentenceLength: { type: Number, default: 0 },
      detectionMethod: { type: String, default: 'heuristic' },
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: auto-delete documents 24 hours after creation for privacy
TextSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Text = mongoose.models.Text || mongoose.model<IText>('Text', TextSchema);
export default Text;
