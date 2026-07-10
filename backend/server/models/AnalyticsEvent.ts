import { Schema, model, Document } from 'mongoose';

interface IAnalyticsEvent extends Document {
  user?: any;
  anonymousId?: string;
  event: string;
  meta: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  anonymousId: {
    type: String,
    required: false,
    trim: true,
  },
  event: {
    type: String,
    required: true,
    trim: true,
  },
  meta: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

AnalyticsEventSchema.index({ user: 1 });
AnalyticsEventSchema.index({ anonymousId: 1 });
AnalyticsEventSchema.index({ event: 1 });

export default model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
