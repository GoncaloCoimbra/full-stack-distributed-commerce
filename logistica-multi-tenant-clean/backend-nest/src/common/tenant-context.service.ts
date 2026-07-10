import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface TenantContext {
  companyId: string;
  userId: string;
}

@Injectable()
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantContext>();

  run<T>(context: TenantContext, callback: () => T): T {
    return this.als.run(context, callback);
  }

  getCompanyId(): string | undefined {
    const store = this.als.getStore();
    return store?.companyId;
  }

  getUserId(): string | undefined {
    const store = this.als.getStore();
    return store?.userId;
  }

  getContext(): TenantContext | undefined {
    return this.als.getStore();
  }
}
