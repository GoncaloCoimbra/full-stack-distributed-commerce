import fs from 'fs';
import winston from 'winston';
import path from 'path';
import { env } from './env';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const customLevels = {
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
	},
	colors: {
		fatal: 'red',
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'blue',
	},
};

// Create logger
export const logger = winston.createLogger({
	levels: customLevels.levels,
	level: env.LOG_LEVEL || 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),
	defaultMeta: { service: 'Tranzor-backend' },
	transports: [
		// Write all logs to console
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevels.colors }),
				winston.format.printf(({ timestamp, level, message, ...meta }) => {
					const metaStr = Object.keys(meta).length
						? JSON.stringify(meta, null, 2)
						: '';
					return `${timestamp} [${level}]: ${message} ${metaStr}`;
				})
			),
		}),

		// Write error logs to file
		new winston.transports.File({
			filename: path.join(logsDir, 'error.log'),
			level: 'error',
			format: winston.format.json(),
		}),

		// Write all logs to file
		new winston.transports.File({
			filename: path.join(logsDir, 'combined.log'),
			format: winston.format.json(),
		}),
	],
});

// Log unhandled exceptions
logger.exceptions.handle(
	new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') })
);

// Log unhandled rejections
logger.rejections.handle(
	new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') })
);

export default logger;
