import { Schema, model, Document } from 'mongoose';

interface IApprovalItem {
  product: Schema.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

interface IApprovalRequest extends Document {
  requestor: Schema.Types.ObjectId;
  approver: Schema.Types.ObjectId;
  account: Schema.Types.ObjectId;
  items: IApprovalItem[];
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  decisionMessage?: string;
  decisionBy?: Schema.Types.ObjectId;
  decisionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalItemSchema = new Schema<IApprovalItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
}, { _id: false });

const ApprovalRequestSchema = new Schema<IApprovalRequest>({
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [ApprovalItemSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  comment: String,
  decisionMessage: String,
  decisionBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  decisionAt: Date
}, {
  timestamps: true
});

ApprovalRequestSchema.index({ requestor: 1 });
ApprovalRequestSchema.index({ approver: 1 });
ApprovalRequestSchema.index({ account: 1 });
ApprovalRequestSchema.index({ status: 1 });

export default model<IApprovalRequest>('ApprovalRequest', ApprovalRequestSchema);
