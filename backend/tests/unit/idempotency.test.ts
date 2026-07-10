import { describe, expect, it, beforeEach } from '@jest/globals';
import { getIdempotencyRecord, setIdempotencyProcessing, setIdempotencyResult } from '../../server/utils/idempotency';

describe('idempotency utils', () => {
  const key = 'checkout:test-key';

  beforeEach(async () => {
    await setIdempotencyResult(key, { status: 'completed', statusCode: 201, response: { ok: true } });
  });

  it('returns a stored response for the same key', async () => {
    const result = await getIdempotencyRecord(key);
    expect(result?.response).toEqual({ ok: true });
    expect(result?.status).toBe('completed');
  });

  it('stores processing state for new keys', async () => {
    const processingKey = 'checkout:processing';
    await setIdempotencyProcessing(processingKey);
    const record = await getIdempotencyRecord(processingKey);
    expect(record?.status).toBe('processing');
  });
});
