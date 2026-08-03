"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../src/auth");
describe('parseUserIdFromToken', () => {
    const secret = 'test-secret';
    function createSignedToken(payload) {
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = crypto_1.default.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
        return `${header}.${body}.${signature}`;
    }
    it('returns the user id for a valid signed token', () => {
        process.env.JWT_SECRET = secret;
        const token = createSignedToken({ sub: 'user-123' });
        expect((0, auth_1.parseUserIdFromToken)(`Bearer ${token}`)).toBe('user-123');
    });
    it('rejects a token with an invalid signature', () => {
        process.env.JWT_SECRET = secret;
        const token = createSignedToken({ sub: 'user-123' }).slice(0, -1) + 'x';
        expect((0, auth_1.parseUserIdFromToken)(`Bearer ${token}`)).toBeNull();
    });
    it('rejects an expired token', () => {
        process.env.JWT_SECRET = secret;
        const token = createSignedToken({ sub: 'user-123', exp: Math.floor(Date.now() / 1000) - 60 });
        expect((0, auth_1.parseUserIdFromToken)(`Bearer ${token}`)).toBeNull();
    });
    it('returns null when no bearer token is provided', () => {
        expect((0, auth_1.parseUserIdFromToken)(undefined)).toBeNull();
    });
});
