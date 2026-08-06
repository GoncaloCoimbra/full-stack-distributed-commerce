import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { sendOrderConfirmation } from '../services/emailService';

const router = Router();

// GET /account/profile - Get user profile
router.get('/profile', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId)
			.select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken')
			.populate('favorites', 'name price images slug inStock');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		res.json({
			success: true,
			data: {
				user
			}
		});
	} catch (error) {
		console.error('Get profile error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// PUT /account/profile - Update user profile
router.put('/profile', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const {
			name,
			email,
			phone,
			company,
			taxId,
			address,
			isStudent
		} = req.body;

		const updateData: any = {};

		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (phone !== undefined) updateData['profile.phone'] = phone;
		if (company !== undefined) updateData['profile.company'] = company;
		if (taxId !== undefined) updateData['profile.taxId'] = taxId;
		if (isStudent !== undefined) updateData['profile.isStudent'] = Boolean(isStudent);
		if (address) {
			if (typeof address === 'string') {
				updateData['profile.address'] = {
					street: address,
					city: '',
					postalCode: '',
					country: 'Portugal'
				};
			} else {
				updateData['profile.address'] = address;
			}
		}

		const user = await User.findByIdAndUpdate(
			userId,
			updateData,
			{ returnDocument: 'after', runValidators: true }
		).select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		res.json({
			success: true,
			message: 'Perfil atualizado com sucesso',
			data: {
				user
			}
		});
	} catch (error) {
		console.error('Update profile error:', error);

		if (error instanceof Error && error.name === 'ValidationError') {
			const errors = Object.values((error as any).errors).map((err: any) => err.message);
			return res.status(400).json({
				success: false,
				error: errors.join(', ')
			});
		}

		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// PUT /account/change-password - Change password
router.put('/change-password', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				error: 'Password atual e nova password são obrigatórias'
			});
		}

		if (newPassword.length < 8) {
			return res.status(400).json({
				success: false,
				error: 'Nova password deve ter pelo menos 8 caracteres'
			});
		}

		const user = await User.findById(userId).select('+password');
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		const isValidPassword = await user.comparePassword(currentPassword);
		if (!isValidPassword) {
			return res.status(400).json({
				success: false,
				error: 'Password atual incorreta'
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);
		user.password = hashedPassword;
		await user.save();

		res.json({
			success: true,
			message: 'Password alterada com sucesso'
		});
	} catch (error) {
		console.error('Change password error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// POST /account/client-card - Create a client card for the user
router.post('/client-card', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		if (user.clientCard) {
			return res.status(400).json({
				success: false,
				error: 'Ficha de cliente já existe'
			});
		}

		user.clientCard = {
			id: `CC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
			createdAt: new Date()
		};

		await user.save();

		res.status(201).json({
			success: true,
			clientCard: user.clientCard
		});
	} catch (error) {
		console.error('Create client card error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// GET /account/favorites - Get user favorites
router.get('/favorites', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId).populate('favorites', 'name price images slug inStock');
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		res.json({
			success: true,
			favorites: user.favorites
		});
	} catch (error) {
		console.error('Get favorites error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// POST /account/favorites - Add a product to favorites
router.post('/favorites', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;
		const { productId } = req.body;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		if (!productId) {
			return res.status(400).json({
				success: false,
				error: 'ID do produto é obrigatório'
			});
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				success: false,
				error: 'Produto não encontrado'
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		const productIdString = product._id.toString();
		if (user.favorites.some((fav: any) => fav.toString() === productIdString)) {
			return res.json({
				success: true,
				message: 'Produto já está nos favoritos'
			});
		}

		user.favorites.push(product._id as any);
		await user.save();

		res.json({
			success: true,
			message: 'Produto adicionado aos favoritos'
		});
	} catch (error) {
		console.error('Add favorite error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// DELETE /account/favorites/:productId - Remove a product from favorites
router.delete('/favorites/:productId', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;
		const { productId } = req.params;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		user.favorites = user.favorites.filter((id: any) => id.toString() !== productId);
		await user.save();

		res.json({
			success: true,
			message: 'Produto removido dos favoritos'
		});
	} catch (error) {
		console.error('Remove favorite error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// GET /account/orders - Get user orders
router.get('/orders', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const { page = 1, limit = 10, status } = req.query;

		const query: any = { user: userId };
		if (status) query.status = status;

		const skip = (Number(page) - 1) * Number(limit);

		const orders = await Order.find(query)
			.sort({ createdAt: -1 })
			.limit(Number(limit))
			.skip(skip)
			.populate('items.product', 'name images sku')
			.select('-__v');

		const total = await Order.countDocuments(query);

		res.json({
			success: true,
			orders,
			pagination: {
				currentPage: Number(page),
				totalPages: Math.ceil(total / Number(limit)),
				totalOrders: total
			}
		});
	} catch (error) {
		console.error('Get orders error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// GET /account/orders/:id - Get order details
router.get('/orders/:id', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const order = await Order.findOne({
			_id: req.params.id,
			user: userId
		})
		.populate('items.product', 'name images sku category')
		.populate('user', 'name email');

		if (!order) {
			return res.status(404).json({
				success: false,
				error: 'Encomenda não encontrada'
			});
		}

		res.json({
			success: true,
			order
		});
	} catch (error) {
		console.error('Get order error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// POST /account/orders - Create a new order
router.post('/orders', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const {
			items,
			shippingAddress,
			billingAddress,
			paymentMethod,
			shippingMethod,
			shippingCost = 0,
			tax = 0,
			discount = 0,
			loyaltyPointsUsed = 0,
			notes
		} = req.body;

		if (!Array.isArray(items) || items.length === 0) {
			return res.status(400).json({
				success: false,
				error: 'A encomenda deve conter pelo menos um item'
			});
		}

		if (!shippingAddress || !paymentMethod || !shippingMethod) {
			return res.status(400).json({
				success: false,
				error: 'Dados de envio, método de pagamento e método de entrega são obrigatórios'
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		if (loyaltyPointsUsed < 0 || loyaltyPointsUsed > user.loyaltyPoints) {
			return res.status(400).json({
				success: false,
				error: 'Pontos de fidelidade inválidos'
			});
		}

		const productIds = items.map((item: any) => item.productId);
		const products = await Product.find({ _id: { $in: productIds }, isActive: true });

		if (products.length !== items.length) {
			return res.status(400).json({
				success: false,
				error: 'Um ou mais produtos não estão disponíveis'
			});
		}

		const orderItems = items.map((item: any) => {
			const product = products.find(p => p._id.toString() === item.productId);
			if (!product) {
				throw new Error('Produto não encontrado');
			}

			if (!product.inStock || product.stockQuantity < item.quantity) {
				throw new Error(`O produto ${product.name} não tem stock suficiente`);
			}

			const price = product.salePrice ?? product.price;
			return {
				product: product._id,
				name: product.name,
				sku: product.sku,
				price,
				quantity: Number(item.quantity),
				variants: item.variants || {},
				total: Number(item.quantity) * price
			};
		});

		const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.total, 0);
		const loyaltyDiscount = Number(loyaltyPointsUsed) * 0.01;
		const orderDiscount = Number(discount) + loyaltyDiscount;
		const total = Math.max(subtotal + Number(shippingCost) + Number(tax) - orderDiscount, 0);

		const order = new Order({
			user: user._id,
			items: orderItems,
			subtotal,
			tax: Number(tax),
			shipping: Number(shippingCost),
			discount: orderDiscount,
			total,
			currency: 'EUR',
			paymentStatus: 'paid',
			paymentMethod,
			shippingAddress,
			billingAddress: billingAddress || shippingAddress,
			shippingMethod,
			notes,
			loyaltyPointsEarned: Math.floor(total / 10),
			loyaltyPointsUsed: Number(loyaltyPointsUsed)
		});

		order.calculateTotals();
		await order.save();

		await Promise.all(products.map(async (product) => {
			const item = orderItems.find((orderItem: any) => orderItem.product.toString() === product._id.toString());
			if (!item) return;
			product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
			if (product.stockQuantity === 0) {
				product.inStock = false;
			}
			product.salesCount += item.quantity;
			await product.save();
		}));

		user.loyaltyPoints = Math.max(0, user.loyaltyPoints - Number(loyaltyPointsUsed));
		user.loyaltyPoints += order.loyaltyPointsEarned;
		await user.save();

		await sendOrderConfirmation(user.email, {
			orderNumber: order.orderNumber,
			orderId: order._id,
			items: order.items,
			total: order.total,
			status: order.status
		});

		res.status(201).json({
			success: true,
			message: 'Encomenda criada com sucesso',
			order
		});
	} catch (error: any) {
		console.error('Create order error:', error);

		if (error.message && error.message.startsWith('O produto')) {
			return res.status(400).json({
				success: false,
				error: error.message
			});
		}

		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// GET /account/loyalty - Get loyalty points info
router.get('/loyalty', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId).select('loyaltyPoints');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		// Calculate loyalty tier
		let tier = 'Bronze';
		let discount = 0;

		if (user.loyaltyPoints >= 1000) {
			tier = 'Gold';
			discount = 10;
		} else if (user.loyaltyPoints >= 500) {
			tier = 'Silver';
			discount = 5;
		}

		const nextTierPoints = tier === 'Bronze' ? 500 : tier === 'Silver' ? 1000 : null;
		const pointsToNextTier = nextTierPoints ? nextTierPoints - user.loyaltyPoints : 0;

		res.json({
			success: true,
			loyalty: {
				points: user.loyaltyPoints,
				tier,
				discount,
				nextTierPoints,
				pointsToNextTier
			}
		});
	} catch (error) {
		console.error('Get loyalty error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// POST /account/deactivate - Deactivate account
router.post('/deactivate', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const { password, reason } = req.body;

		if (!password) {
			return res.status(400).json({
				success: false,
				error: 'Password é obrigatória para desativar a conta'
			});
		}

		const user = await User.findById(userId).select('+password');
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		const isValidPassword = await user.comparePassword(password);
		if (!isValidPassword) {
			return res.status(400).json({
				success: false,
				error: 'Password incorreta'
			});
		}

		user.isActive = false;
		if (reason) {
			// Store deactivation reason (you might want to add this field to the schema)
			user.set('deactivationReason', reason);
		}
		await user.save();

		res.json({
			success: true,
			message: 'Conta desativada com sucesso'
		});
	} catch (error) {
		console.error('Deactivate account error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// GET /account/addresses - Get user addresses
router.get('/addresses', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const user = await User.findById(userId).select('profile.address');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		res.json({
			success: true,
			addresses: user.profile?.address ? [user.profile.address] : []
		});
	} catch (error) {
		console.error('Get addresses error:', error);
		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

// PUT /account/addresses - Update user address
router.put('/addresses', async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Autenticação necessária'
			});
		}

		const { address } = req.body;

		if (!address) {
			return res.status(400).json({
				success: false,
				error: 'Endereço é obrigatório'
			});
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ 'profile.address': address },
			{ returnDocument: 'after', runValidators: true }
		).select('profile.address');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Usuário não encontrado'
			});
		}

		res.json({
			success: true,
			message: 'Endereço atualizado com sucesso',
			addresses: [user.profile?.address]
		});
	} catch (error) {
		console.error('Update address error:', error);

		if (error instanceof Error && error.name === 'ValidationError') {
			const errors = Object.values((error as any).errors).map((err: any) => err.message);
			return res.status(400).json({
				success: false,
				error: errors.join(', ')
			});
		}

		res.status(500).json({
			success: false,
			error: 'Erro interno do servidor'
		});
	}
});

export default router;