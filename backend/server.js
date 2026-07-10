"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./server/config/app");
const logger_1 = require("./server/config/logger");
const prisma_1 = require("./server/config/prisma");
const cache_1 = require("./server/utils/cache");
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.APP_SHUTDOWN_TIMEOUT_MS || 10000);
let server = null;
const shutdown = async (signal) => {
    try {
        logger_1.logger.info(`Received ${signal}, starting graceful shutdown`);
        if (server) {
            logger_1.logger.info(`Closing HTTP server with ${SHUTDOWN_TIMEOUT_MS}ms timeout`);
            server.closeAllConnections?.();
            await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    logger_1.logger.warn('HTTP server shutdown timeout reached, forcing exit');
                    resolve();
                }, SHUTDOWN_TIMEOUT_MS);
                server.close(() => {
                    clearTimeout(timeout);
                    logger_1.logger.info('HTTP server closed');
                    resolve();
                });
            });
        }
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.disconnect();
            logger_1.logger.info('MongoDB disconnected');
        }
        await (0, prisma_1.disconnectPrismaClients)();
        logger_1.logger.info('Prisma clients disconnected');
        await (0, cache_1.disconnectRedis)();
        logger_1.logger.info('Redis disconnected');
    }
    catch (error) {
        logger_1.logger.error('Graceful shutdown error:', error);
    }
    finally {
        process.exit(0);
    }
};
const startServer = async () => {
    try {
        await (0, prisma_1.initializePrismaClients)();
        server = app_1.app.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
startServer();
