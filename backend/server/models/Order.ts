import { Schema, model, Document } from 'mongoose';
import { addMoney, roundMoney } from '../utils/money';
import { softDeleteAuditPlugin } from '../utils/mongoosePlugins';

interface IOrderItem {
	product: Schema.Types.ObjectId;
	name: string;
	sku: string;
	price: number;
	quantity: number;
	variants?: Record<string, string>;
	total: number;
}

interface IShippingAddress {
	name: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
}

interface IOrder extends Document {
	orderNumber: string;
	user: Schema.Types.ObjectId;
	items: IOrderItem[];
	subtotal: number;
	tax: number;
	shipping: number;
	discount: number;
	total: number;
	currency: string;
	status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed';
	paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
	paymentMethod: string;
	failureReason?: string;
	paymentIntentId?: string;
	shippingAddress: IShippingAddress;
	billingAddress: IShippingAddress;
	shippingMethod: string;
	trackingNumber?: string;
	notes?: string;
	loyaltyPointsEarned: number;
	loyaltyPointsUsed: number;
	refundedAmount: number;
	cancelledAt?: Date;
	cancelledReason?: string;
	shippedAt?: Date;
	deliveredAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	calculateTotals(): void;
	updateStatus(newStatus: string, reason?: string): Promise<void>;
}

const OrderItemSchema = new Schema({
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
	variants: {
		type: Map,
		of: String
	},
	total: {
		type: Number,
		required: true,
		min: 0
	}
}, { _id: false });

const AddressSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	street: { type: String, required: true },
	city: { type: String, required: true },
	postalCode: { type: String, required: true },
	country: { type: String, required: true, default: 'Portugal' }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
	orderNumber: {
		type: String,
		required: true,
		unique: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	items: [OrderItemSchema],
	subtotal: {
		type: Number,
		required: true,
		min: 0
	},
	tax: {
		type: Number,
		default: 0,
		min: 0
	},
	shipping: {
		type: Number,
		default: 0,
		min: 0
	},
	discount: {
		type: Number,
		default: 0,
		min: 0
	},
	total: {
		type: Number,
		required: true,
		min: 0
	},
	currency: {
		type: String,
		default: 'EUR'
	},
	status: {
		type: String,
		enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed'],
		default: 'pending'
	},
	paymentStatus: {
		type: String,
		enum: ['pending', 'paid', 'failed', 'refunded'],
		default: 'pending'
	},
	paymentMethod: {
		type: String,
		required: true
	},
	paymentIntentId: String,
	shippingAddress: AddressSchema,
	billingAddress: AddressSchema,
	shippingMethod: {
		type: String,
		required: true
	},
	trackingNumber: String,
	notes: String,
	failureReason: String,
	loyaltyPointsEarned: {
		type: Number,
		default: 0,
		min: 0
	},
	loyaltyPointsUsed: {
		type: Number,
		default: 0,
		min: 0
	},
	refundedAmount: {
		type: Number,
		default: 0,
		min: 0
	},
	cancelledAt: Date,
	cancelledReason: String,
	shippedAt: Date,
	deliveredAt: Date
}, {
	timestamps: true
});

// Indexes
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

OrderSchema.plugin(softDeleteAuditPlugin);

// Pre-save middleware to generate order number
OrderSchema.pre('save', function(next: any) {
	if (this.isNew && !this.orderNumber) {
		const timestamp = Date.now().toString().slice(-6);
		const random = Math.random().toString(36).substring(2, 5).toUpperCase();
		this.orderNumber = `OLM-${timestamp}-${random}`;
	}
	next();
});

// Virtual for total items count
OrderSchema.virtual('totalItems').get(function() {
	return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Instance method to calculate totals
OrderSchema.methods.calculateTotals = function() {
	this.subtotal = roundMoney(this.items.reduce((sum: number, item: any) => sum + item.total, 0));
	this.tax = roundMoney(this.tax || 0);
	this.shipping = roundMoney(this.shipping || 0);
	this.discount = roundMoney(this.discount || 0);
	this.total = roundMoney(Math.max(addMoney(this.subtotal, this.tax, this.shipping) - this.discount, 0));
};

// Instance method to update status with timestamps
OrderSchema.methods.updateStatus = async function(newStatus: string, reason?: string) {
	this.status = newStatus;

	switch (newStatus) {
		case 'cancelled':
			this.cancelledAt = new Date();
			if (reason) this.cancelledReason = reason;
			break;
		case 'shipped':
			this.shippedAt = new Date();
			break;
		case 'delivered':
			this.deliveredAt = new Date();
			break;
	}

	await this.save();
};

// Static method to find user orders
OrderSchema.statics.findByUser = function(userId: string, limit = 20) {
	return this.find({ user: userId as any, isDeleted: false })
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate('items.product');
};

export default model<IOrder>('Order', OrderSchema);