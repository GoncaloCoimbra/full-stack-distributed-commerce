/**
 * Field-Level Encryption (FLE)
 * Encriptação AES-256 transparente para colunas sensíveis no Prisma.
 * Dados sensíveis (NIFs, saldos de crédito) são encriptados antes de entrar no PostgreSQL.
 */

import crypto from 'crypto';
import { env } from '../config/env';

export class FieldEncryption {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  private saltLength = 16;
  private tagLength = 16;
  private ivLength = 12;

  constructor(encryptionKey?: string) {
    // Usar a chave de encriptação do .env ou gerar uma derivada do JWT_SECRET
    const masterKey = encryptionKey || env.JWT_SECRET;

    // Derivar uma chave de 32 bytes (256 bits) usando PBKDF2
    this.key = crypto.pbkdf2Sync(masterKey, 'Tranzor-field-encryption', 100000, 32, 'sha256');
  }

  /**
   * Encriptar um valor sensível
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);

    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as crypto.CipherGCM;
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Formato: salt(16) + iv(12) + tag(16) + ciphertext
    const result = Buffer.concat([salt, iv, tag, encrypted]);
    return result.toString('base64');
  }

  /**
   * Desencriptar um valor
   */
  decrypt(ciphertext: string): string {
    const buffer = Buffer.from(ciphertext, 'base64');

    // Extrair componentes
    const salt = buffer.slice(0, this.saltLength);
    void salt;
    const iv = buffer.slice(this.saltLength, this.saltLength + this.ivLength);
    const tag = buffer.slice(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength);
    const encrypted = buffer.slice(this.saltLength + this.ivLength + this.tagLength);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }

  /**
   * Validar se uma string é uma ciphertext válida (base64 com tamanho mínimo)
   */
  isCiphertextFormat(value: any): boolean {
    if (typeof value !== 'string') return false;
    try {
      const buffer = Buffer.from(value, 'base64');
      return buffer.length > this.saltLength + this.ivLength + this.tagLength;
    } catch {
      return false;
    }
  }
}

/**
 * Decoradores para Mongoose para encriptação automática
 */
export function Encrypted() {
  return function (target: any, propertyKey: string) {
    const originalGetter = Object.getOwnPropertyDescriptor(target, propertyKey)?.get;
    const originalSetter = Object.getOwnPropertyDescriptor(target, propertyKey)?.set;
    void originalGetter;
    void originalSetter;

    const encryption = new FieldEncryption();

    Object.defineProperty(target, propertyKey, {
      get: function () {
        const value = this[`_${propertyKey}`];
        if (value && encryption.isCiphertextFormat(value)) {
          return encryption.decrypt(value);
        }
        return value;
      },
      set: function (value: string) {
        if (value && !encryption.isCiphertextFormat(value)) {
          this[`_${propertyKey}`] = encryption.encrypt(value);
        } else {
          this[`_${propertyKey}`] = value;
        }
      },
    });
  };
}

/**
 * Middleware do Prisma para encriptação/desencriptação automática
 */
export const fieldEncryptionMiddleware = () => {
  const encryption = new FieldEncryption();

  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    const sensitiveFields = ['nif', 'creditBalance', 'bankAccount', 'taxId'];

    // Encriptar antes de escrever
    if (['create', 'update', 'upsert'].includes(params.action)) {
      for (const field of sensitiveFields) {
        if (params.args.data && params.args.data[field]) {
          params.args.data[field] = encryption.encrypt(params.args.data[field]);
        }
      }
    }

    const result = await next(params);

    // Desencriptar após ler
    if (['findUnique', 'findFirst', 'findMany'].includes(params.action) && result) {
      const decrypt = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(decrypt);
        }
        if (obj && typeof obj === 'object') {
          for (const field of sensitiveFields) {
            if (obj[field] && encryption.isCiphertextFormat(obj[field])) {
              obj[field] = encryption.decrypt(obj[field]);
            }
          }
        }
        return obj;
      };

      return decrypt(result);
    }

    return result;
  };
};

export const fieldEncryption = new FieldEncryption();
