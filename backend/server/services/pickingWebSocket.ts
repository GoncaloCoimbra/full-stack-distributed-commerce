/**
 * WebSocket Events para Picking & WMS
 * Notificações em tempo real para updates de picking
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import Picking from '../models/Picking';

export interface PickingSocketEvents {
  // Cliente → Servidor
  'picking:subscribe': (data: { status: string; userId?: string }) => void;
  'picking:unsubscribe': () => void;
  'picking:start': (data: { pickingId: string }) => void;
  'picking:update-item': (data: { pickingId: string; itemIndex: number; quantityPicked: number }) => void;
  'picking:complete': (data: { pickingId: string }) => void;

  // Servidor → Cliente
  'picking:updated': (data: any) => void;
  'picking:completed': (data: any) => void;
  'picking:started': (data: any) => void;
  'picking:new': (data: any) => void;
  'wms:stats': (data: any) => void;
}

export class PickingWebSocketHandler {
  private io: SocketIOServer;
  private userSubscriptions: Map<string, string[]> = new Map(); // userId → [pickingIds]

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEvents();
  }

  /**
   * Configurar handlers de WebSocket
   */
  private setupEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[WS] User conectado: ${socket.id}`);

      // Subscribing a picking events
      socket.on('picking:subscribe', async (data: { status: string; userId?: string }) => {
        const { status, userId } = data;

        const query: any = {};
        if (status && status !== 'all') {
          query.status = status;
        }
        if (userId) {
          query.assignedTo = userId;
        }

        const pickings = await Picking.find(query).select('_id');
        const pickingIds = pickings.map((p) => p._id.toString());

        this.userSubscriptions.set(socket.id, pickingIds);
        socket.join(`picking:${status}`);

        socket.emit('picking:subscribed', {
          message: `Subscrito a picking:${status}`,
          pickingCount: pickingIds.length,
        });
      });

      // Unsubscribe
      socket.on('picking:unsubscribe', () => {
        this.userSubscriptions.delete(socket.id);
        const rooms = Array.from((socket as any).adapter?.rooms?.get(socket.id) || []);
        rooms.forEach((room: unknown) => {
          if (typeof room === 'string') {
            try {
              void socket.leave(room);
            } catch {
              // ignore room cleanup failures during demo/runtime teardown
            }
          }
        });
      });

      socket.on('disconnect', () => {
        this.userSubscriptions.delete(socket.id);
        console.log(`[WS] User desconectado: ${socket.id}`);
      });
    });
  }

  /**
   * Broadcast quando um picking é criado
   */
  broadcastPickingCreated(picking: any) {
    this.io.to('picking:pending').emit('picking:new', {
      pickingId: picking._id,
      pickingNumber: picking.pickingNumber,
      order: picking.order,
      priority: picking.priority,
      boxType: picking.boxInfo.boxType,
      itemCount: picking.items.length,
      createdAt: picking.createdAt,
    });
  }

  /**
   * Broadcast quando um picking é iniciado
   */
  broadcastPickingStarted(picking: any) {
    this.io.to('picking:in_progress').emit('picking:started', {
      pickingId: picking._id,
      pickingNumber: picking.pickingNumber,
      assignedTo: picking.assignedTo,
      startedAt: picking.startedAt,
    });

    this.io.to(`picking:${picking._id}`).emit('picking:updated', {
      status: 'in_progress',
      startedAt: picking.startedAt,
    });
  }

  /**
   * Broadcast quando um item é marcado como picked
   */
  broadcastPickingItemUpdated(picking: any, itemIndex: number) {
    const item = picking.items[itemIndex];

    this.io.to(`picking:${picking._id}`).emit('picking:updated', {
      pickingId: picking._id,
      item: {
        index: itemIndex,
        sku: item.sku,
        quantityPicked: item.quantityPicked,
        quantity: item.quantity,
      },
      progress: this.calculatePickingProgress(picking),
    });
  }

  /**
   * Broadcast quando um picking é completado
   */
  broadcastPickingCompleted(picking: any) {
    this.io.to('picking:completed').emit('picking:completed', {
      pickingId: picking._id,
      pickingNumber: picking.pickingNumber,
      order: picking.order,
      completedAt: picking.completedAt,
      boxType: picking.boxInfo.boxType,
      weight: picking.boxInfo.weight,
    });

    this.io.to(`picking:${picking._id}`).emit('picking:updated', {
      status: 'completed',
      completedAt: picking.completedAt,
    });
  }

  /**
   * Broadcast de estatísticas WMS (a cada minuto)
   */
  broadcastWMSStats(stats: any) {
    this.io.emit('wms:stats', stats);
  }

  /**
   * Calcular progresso de picking
   */
  private calculatePickingProgress(picking: any): number {
    const totalQty = picking.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const pickedQty = picking.items.reduce((sum: number, item: any) => sum + item.quantityPicked, 0);

    return Math.round((pickedQty / totalQty) * 100);
  }

  /**
   * Obter io server
   */
  getIO() {
    return this.io;
  }
}

/**
 * Inicializar WebSocket para Picking
 * Para ser chamado no app.ts quando o servidor HTTP é criado
 */
export function initializePickingWebSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  return new PickingWebSocketHandler(io);
}
