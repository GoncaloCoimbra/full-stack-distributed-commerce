import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    this.logger.log(` TenantGuard - ${method} ${url}`);

    if (!user) {
      this.logger.error(' User not authenticated');
      throw new ForbiddenException('User not authenticated');
    }

    // SUPER_ADMIN has full access
    if (user.role === Role.SUPER_ADMIN) {
      this.logger.log('SUPER_ADMIN - full access');
      return true;
    }

    // Validate if user has companyId
    if (!user.companyId) {
      this.logger.error(` User ${user.email} without associated company`);
      throw new ForbiddenException('User without associated company');
    }

    // Inject companyId in body (POST/PATCH/PUT)
    if (['POST', 'PATCH', 'PUT'].includes(method) && request.body) {
      // Validate if trying to manipulate data from another company
      if (request.body.companyId && request.body.companyId !== user.companyId) {
        this.logger.error(
          ` User ${user.email} tried to manipulate company ${request.body.companyId}`,
        );
        throw new ForbiddenException(
          'Cannot manipulate data from another company',
        );
      }

      // Force user's companyId
      request.body.companyId = user.companyId;
      this.logger.debug(`CompanyId injected: ${user.companyId}`);
    }

    // Validate companyId in params (GET/DELETE with :companyId in route)
    if (
      request.params?.companyId &&
      request.params.companyId !== user.companyId
    ) {
      this.logger.error(
        ` User ${user.email} tried to access company ${request.params.companyId}`,
      );
      throw new ForbiddenException('Cannot access data from another company');
    }

    // Make companyId directly available in request
    request.companyId = user.companyId;

    this.logger.log(`Tenant OK - ${user.email} | Company: ${user.companyId}`);
    return true;
  }
}
