import { Schema, model, Document } from 'mongoose';

export interface IB2BQuote extends Document {
  quoteNumber: string;
  user?: Schema.Types.ObjectId;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  category: string;
  quantity: number;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'review';
  priority: 'high' | 'medium' | 'low';
  totalEstimate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const B2BQuoteSchema = new Schema<IB2BQuote>({
  quoteNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'expired', 'review'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  totalEstimate: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

B2BQuoteSchema.pre('save', function() {
  if (this.isNew && !this.quoteNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.quoteNumber = `B2B-${timestamp}-${random}`;
  }
});

B2BQuoteSchema.index({ quoteNumber: 1 });
B2BQuoteSchema.index({ user: 1 });
B2BQuoteSchema.index({ status: 1 });
B2BQuoteSchema.index({ createdAt: -1 });

export default model<IB2BQuote>('B2BQuote', B2BQuoteSchema);
