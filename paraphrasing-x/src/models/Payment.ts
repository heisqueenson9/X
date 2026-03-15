import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  textId: string;
  screenshotPath: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  amount: number;
  network: string;
  paymentNumber: string;
  paymentName: string;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    textId: {
      type: String,
      required: true,
      index: true,
    },
    screenshotPath: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 11, // GHS 11
    },
    network: {
      type: String,
      required: true,
      default: 'Telecel Cash',
    },
    paymentNumber: {
      type: String,
      required: true,
      default: '0202979378',
    },
    paymentName: {
      type: String,
      required: true,
      default: 'Paraphrasing X',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
