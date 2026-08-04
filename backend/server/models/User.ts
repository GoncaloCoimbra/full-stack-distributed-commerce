import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: 'user' | 'admin' | 'b2b' | 'b2b_buyer' | 'b2b_manager';
	accountRole: 'primary' | 'requester';
	parentAccount?: Schema.Types.ObjectId;
	isActive: boolean;
	emailVerified: boolean;
	emailVerificationToken?: string;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	profile: {
		phone?: string;
		address?: {
			street?: string;
			city?: string;
			postalCode?: string;
			country?: string;
		};
		company?: string;
		taxId?: string;
		isStudent?: boolean;
	};
	clientCard?: {
		id: string;
		createdAt: Date;
	};
	b2bDiscountRate?: number;
	pricingTier?: 'starter' | 'growth' | 'enterprise';
	pricingOverrides?: Array<{
		type: 'percentage' | 'fixed';
		discount?: number;
		amount?: number;
		productId?: string;
		categoryId?: string;
		segment?: 'starter' | 'growth' | 'enterprise';
		minQuantity?: number;
		maxQuantity?: number;
	}>;
	paymentTerms?: 'prepaid' | 'credit';
	creditLimit?: number;
	authorizedProducts?: Schema.Types.ObjectId[];
	b2bCompanyInfo?: {
		companyName?: string;
		registrationNumber?: string;
		approvalDate?: Date;
		approvedBy?: Schema.Types.ObjectId;
		customPricingEnabled?: boolean;
	};
	favorites: Schema.Types.ObjectId[];
	loyaltyPoints: number;
	lastLogin?: Date;
	deactivationReason?: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 100
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/, 'Email inválido']
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'b2b', 'b2b_buyer', 'b2b_manager'],
		default: 'user'
	},
	isActive: {
		type: Boolean,
		default: true
	},
	emailVerified: {
		type: Boolean,
		default: false
	},
	emailVerificationToken: String,
	passwordResetToken: String,
	passwordResetExpires: Date,
	profile: {
		phone: {
			type: String,
			match: [/^\+?[1-9]\d{1,14}$/, 'Número de telefone inválido']
		},
		address: {
			street: String,
			city: String,
			postalCode: String,
			country: {
				type: String,
				default: 'Portugal'
			}
		},
		company: String,
		taxId: {
			type: String,
			match: [/^\d{9}$/, 'NIF inválido']
		},
		isStudent: {
			type: Boolean,
			default: false
		}
	},
	clientCard: {
		id: String,
		createdAt: Date
	},
	b2bDiscountRate: {
		type: Number,
		default: 0,
		min: 0,
		max: 100
	},
	pricingTier: {
		type: String,
		enum: ['starter', 'growth', 'enterprise'],
		default: 'starter'
	},
	pricingOverrides: [{
		type: {
			type: String,
			enum: ['percentage', 'fixed'],
			required: true
		},
		discount: Number,
		amount: Number,
		productId: String,
		categoryId: String,
		segment: {
			type: String,
			enum: ['starter', 'growth', 'enterprise']
		},
		minQuantity: Number,
		maxQuantity: Number
	}],
	paymentTerms: {
		type: String,
		enum: ['prepaid', 'credit'],
		default: 'prepaid'
	},
	creditLimit: {
		type: Number,
		default: 0,
		min: 0
	},
	accountRole: {
		type: String,
		enum: ['primary', 'requester'],
		default: 'primary'
	},
	parentAccount: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	authorizedProducts: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	b2bCompanyInfo: {
		companyName: String,
		registrationNumber: String,
		approvalDate: Date,
		approvedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		customPricingEnabled: {
			type: Boolean,
			default: false
		}
	},
	favorites: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	loyaltyPoints: {
		type: Number,
		default: 0,
		min: 0
	},
	lastLogin: Date,
	deactivationReason: String
}, {
	timestamps: true
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ accountRole: 1 });
UserSchema.index({ parentAccount: 1 });
UserSchema.index({ isActive: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
	return this.name;
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find active users
UserSchema.statics.findActive = function() {
	return this.find({ isActive: true });
};

export default model<IUser>('User', UserSchema);