import { Schema, model, Document, Model } from 'mongoose';

export interface IPickingItem {
  productId: Schema.Types.ObjectId;
  sku: string;
  name: string;
  quantity: number;
  quantityPicked: number;
  location: string; // Localização no armazém (e.g., "A-1-3")
}

export interface IPicking extends Document {
  pickingNumber: string;
  order: Schema.Types.ObjectId;
  items: IPickingItem[];
  assignedTo?: Schema.Types.ObjectId; // Worker que está a fazer o picking
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  boxInfo: {
    boxType: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    volume: number;
    weight: number;
  };
  startedAt?: Date;
  completedAt?: Date;
  estimatedTime: number; // minutos
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPickingModel extends Model<IPicking> {
  findPendingByWarehouse(): Promise<IPicking[]>;
  countByStatus(status: string): Promise<number>;
}

const PickingItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sku: String,
  name: String,
  quantity: {
    type: Number,
    required: true,
  },
  quantityPicked: {
    type: Number,
    default: 0,
  },
  location: String,
});

const PickingSchema = new Schema(
  {
    pickingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    items: [PickingItemSchema],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    boxInfo: {
      boxType: String,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      volume: Number,
      weight: Number,
    },
    startedAt: Date,
    completedAt: Date,
    estimatedTime: Number, // minutos
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Índices para queries comuns
PickingSchema.index({ status: 1, priority: -1, createdAt: 1 });
PickingSchema.index({ order: 1 });
PickingSchema.index({ assignedTo: 1, status: 1 });

// Métodos auxiliares
PickingSchema.statics.findPendingByWarehouse = function () {
  return this.find({ status: 'pending' })
    .sort({ priority: -1, createdAt: 1 })
    .populate('order')
    .populate('items.productId');
};

PickingSchema.statics.countByStatus = function (status: string) {
  return this.countDocuments({ status });
};

export default model<IPicking, IPickingModel>('Picking', PickingSchema);
