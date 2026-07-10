import { Schema, model, Document, Model } from 'mongoose';

interface ICategory extends Document {
	name: string;
	slug: string;
	description?: string;
	image?: string;
	parent?: Schema.Types.ObjectId;
	subcategories: Schema.Types.ObjectId[];
	isActive: boolean;
	sortOrder: number;
	seo: {
		metaTitle?: string;
		metaDescription?: string;
		keywords?: string[];
	};
	productCount: number;
	createdAt: Date;
	updatedAt: Date;
}

interface ICategoryModel extends Model<ICategory> {
	getTree(): Promise<any[]>;
}

const CategorySchema = new Schema<ICategory, ICategoryModel>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 100
	},
	slug: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	description: {
		type: String,
		maxlength: 500
	},
	image: {
		type: String,
		validate: {
			validator: function(v: string) {
				return !v || /^https?:\/\/.+/.test(v);
			},
			message: 'Image URL must be valid'
		}
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	subcategories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}],
	isActive: {
		type: Boolean,
		default: true
	},
	sortOrder: {
		type: Number,
		default: 0
	},
	seo: {
		metaTitle: { type: String, maxlength: 60 },
		metaDescription: { type: String, maxlength: 160 },
		keywords: [String]
	},
	productCount: {
		type: Number,
		default: 0,
		min: 0
	}
}, {
	timestamps: true
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next: any) {
	if (this.isModified('name') && !this.slug) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-zA-Z0-9 ]/g, '')
			.replace(/\s+/g, '-')
			.substring(0, 50);
	}
	next();
});

// Virtual for full path
CategorySchema.virtual('path').get(async function() {
	const path = [this.name];
	let parentId = this.parent as any;
	while (parentId) {
		const parent: any = await model('Category').findById(parentId);
		if (parent) {
			path.unshift(parent.name);
			parentId = parent.parent;
		} else {
			break;
		}
	}
	return path.join(' > ');
});

// Static method to get category tree
CategorySchema.statics.getTree = async function() {
	const categories = await this.find({ isActive: true })
		.sort({ sortOrder: 1, name: 1 })
		.populate('subcategories');

	const buildTree = (parentId: string | null = null): any[] => {
		return categories
			.filter((cat: any) => String(cat.parent) === String(parentId) || (!cat.parent && !parentId))
			.map((cat: any) => ({
				...cat.toObject(),
				children: buildTree(cat._id)
			}));
	};

	return buildTree();
};

export default model<ICategory, ICategoryModel>('Category', CategorySchema);