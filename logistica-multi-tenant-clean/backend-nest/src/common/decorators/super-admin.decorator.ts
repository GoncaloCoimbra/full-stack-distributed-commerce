import { SetMetadata } from '@nestjs/common';

export const IS_SUPER_ADMIN_KEY = 'isSuperAdmin';
export const SuperAdmin = () => SetMetadata(IS_SUPER_ADMIN_KEY, true);
