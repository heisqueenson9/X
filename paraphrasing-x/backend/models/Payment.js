const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  amount: { type: Number, default: 1100 }, // in pesewas (GHS 11)
  currency: { type: String, default: 'GHS' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paystackReference: { type: String },
  paystackAccessCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
