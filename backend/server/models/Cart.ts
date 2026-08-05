import { Schema, model, Document, Types } from 'mongoose';

interface ICartItem {
  product: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  variants?: Record<string, string>;
  image?: string;
  weight?: number;
}

interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      trim: true
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
    variants: {
      type: Map,
      of: String
    },
    image: String,
    weight: {
      type: Number,
      min: 0
    }
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: {
      type: [CartItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default model<ICart>('Cart', CartSchema);
