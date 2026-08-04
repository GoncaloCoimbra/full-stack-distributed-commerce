import { getMongoUri } from '../server/config/mongo';

describe('getMongoUri', () => {
  const originalMongoUri = process.env.MONGODB_URI;

  afterEach(() => {
    if (originalMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoUri;
    }
  });

  it('uses the default app MongoDB URI when no override is provided', () => {
    delete process.env.MONGODB_URI;

    expect(getMongoUri()).toBe('mongodb://localhost:27017/tranzor_test');
  });

  it('prefers an explicit MongoDB URI override', () => {
    process.env.MONGODB_URI = 'mongodb://example.com/custom-db';

    expect(getMongoUri()).toBe('mongodb://example.com/custom-db');
  });
});
