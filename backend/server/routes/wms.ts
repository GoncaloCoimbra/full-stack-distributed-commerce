/**
 * WMS (Warehouse Management System) Routes
 * Endpoints para gestão de picking, packing e envios
 */

import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import { asyncHandler } from '../utils/handlers';
import { authenticate } from '../middleware/auth';
import Picking from '../models/Picking';
import Order from '../models/Order';
import Product from '../models/Product';
import { pickingQueueService } from '../services/pickingQueueService';
import { eventStore, OrderEventType } from '../services/eventSourcing';

const router = Router();

// ============================================================================
// ENDPOINTS DE PICKING
// ============================================================================

/**
 * GET /api/wms/picking/list
 * Listar picking tasks (filtrar por status, worker, etc.)
 */
router.get(
  '/picking/list',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { status = 'pending', assignedTo, limit = 20, skip = 0 } = req.query;

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const pickings = await Picking.find(query)
      .sort({ priority: -1, createdAt: 1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('order')
      .populate('items.productId');

    const total = await Picking.countDocuments(query);

    return res.json({
      success: true,
      data: pickings,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  })
);

/**
 * GET /api/wms/picking/:id
 * Obter detalhes de um picking específico
 */
router.get(
  '/picking/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const picking = await Picking.findById(req.params.id)
      .populate('order')
      .populate('items.productId')
      .populate('assignedTo', 'name email');

    if (!picking) {
      return res.status(404).json({
        success: false,
        error: 'Picking não encontrado',
      });
    }

    return res.json({
      success: true,
      data: picking,
    });
  })
);

/**
 * POST /api/wms/picking/:id/start
 * Iniciar picking (marcar como em progresso, atribuir a worker)
 */
router.post(
  '/picking/:id/start',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const workerId = (req as any).user?.userId;
    const { pickingId } = req.params;

    const picking = await Picking.findById(pickingId);
    if (!picking) {
      return res.status(404).json({
        success: false,
        error: 'Picking não encontrado',
      });
    }

    if (picking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Picking já foi iniciado (status: ${picking.status})`,
      });
    }

    picking.status = 'in_progress';
    picking.assignedTo = workerId;
    picking.startedAt = new Date();
    await picking.save();

    // Registar evento
    await eventStore.appendEvent(
      picking.order.toString(),
      OrderEventType.PICKING_STARTED,
      {
        pickingId: picking._id,
        pickingNumber: picking.pickingNumber,
        workerId,
      },
      { userId: workerId, role: 'user' }
    );

    return res.json({
      success: true,
      message: `Picking ${picking.pickingNumber} iniciado`,
      data: picking,
    });
  })
);

/**
 * PUT /api/wms/picking/:id/item/:itemIndex
 * Marcar item como picked
 */
router.put(
  '/picking/:id/item/:itemIndex',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id, itemIndex } = req.params;
    const { quantityPicked } = req.body;

    if (!quantityPicked || quantityPicked <= 0) {
      return res.status(400).json({
        success: false,
        error: 'quantityPicked deve ser > 0',
      });
    }

    const picking = await Picking.findById(id);
    if (!picking) {
      return res.status(404).json({
        success: false,
        error: 'Picking não encontrado',
      });
    }

    const item = picking.items[Number(itemIndex)];
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item não encontrado no picking',
      });
    }

    if (quantityPicked > item.quantity) {
      return res.status(400).json({
        success: false,
        error: `Quantidade exceeds item quantity (${item.quantity})`,
      });
    }

    item.quantityPicked = quantityPicked;
    await picking.save();

    return res.json({
      success: true,
      message: `Item ${item.sku} marcado como picked (${quantityPicked}/${item.quantity})`,
      data: item,
    });
  })
);

/**
 * POST /api/wms/picking/:id/complete
 * Marcar picking como completo (ready to pack)
 */
router.post(
  '/picking/:id/complete',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const picking = await Picking.findById(req.params.id);
    if (!picking) {
      return res.status(404).json({
        success: false,
        error: 'Picking não encontrado',
      });
    }

    if (picking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        error: `Picking deve estar 'in_progress', está '${picking.status}'`,
      });
    }

    // Verificar se todos os items foram picked
    const allPicked = picking.items.every((item) => item.quantityPicked === item.quantity);
    if (!allPicked) {
      return res.status(400).json({
        success: false,
        error: 'Nem todos os items foram picked completamente',
      });
    }

    picking.status = 'completed';
    picking.completedAt = new Date();
    await picking.save();

    // Registar evento
    await eventStore.appendEvent(
      picking.order.toString(),
      OrderEventType.PICKING_COMPLETED,
      {
        pickingId: picking._id,
        pickingNumber: picking.pickingNumber,
        completedAt: picking.completedAt,
      },
      { userId: picking.assignedTo?.toString(), role: 'user' }
    );

    return res.json({
      success: true,
      message: `Picking ${picking.pickingNumber} completado`,
      data: picking,
    });
  })
);

/**
 * GET /api/wms/picking/stats
 * Obter estatísticas de picking
 */
router.get(
  '/picking/stats',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await pickingQueueService.getPickingStats();

    // Tempo médio de picking
    const completedPickings = await Picking.find({ status: 'completed' }).select('startedAt completedAt');
    const avgTime =
      completedPickings.length > 0
        ? completedPickings.reduce((sum, p) => {
            const duration = p.completedAt! && p.startedAt! ? (p.completedAt.getTime() - p.startedAt.getTime()) / 60000 : 0;
            return sum + duration;
          }, 0) / completedPickings.length
        : 0;

    return res.json({
      success: true,
      data: {
        ...stats,
        averagePickingTime: parseFloat(avgTime.toFixed(2)),
      },
    });
  })
);

/**
 * GET /api/wms/picking/worker/:workerId
 * Listar pickings atribuídos a um worker
 */
router.get(
  '/picking/worker/:workerId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const workerObjectId = Types.ObjectId.isValid(req.params.workerId)
      ? new Types.ObjectId(req.params.workerId)
      : req.params.workerId;

    const pickings = await Picking.find({ assignedTo: workerObjectId as any })
      .sort({ status: 1, priority: -1 })
      .populate('order')
      .populate('items.productId');

    return res.json({
      success: true,
      data: pickings,
    });
  })
);

// ============================================================================
// ENDPOINTS DE WAREHOUSE
// ============================================================================

/**
 * GET /api/wms/warehouse/dashboard
 * Dashboard do armazém (visão geral)
 */
router.get(
  '/warehouse/dashboard',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await pickingQueueService.getPickingStats();

    // Picking por prioridade
    const byPriority = await Picking.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Orders esperando picking
    const ordersPending = await Order.countDocuments({ status: 'confirmed', paymentStatus: 'paid' });

    return res.json({
      success: true,
      data: {
        picking: stats,
        byPriority,
        ordersPendingPickingQueue: ordersPending,
      },
    });
  })
);

export default router;
