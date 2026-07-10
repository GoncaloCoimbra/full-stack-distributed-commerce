// src/common/guards/jwt-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; // 💡 1. Importar o Reflector
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 💡 2. Injetar o Reflector no construtor
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 3. Check se o decorador '@Public()' está presente
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), // Verifica o método (@Post('login'))
      context.getClass(), // Verifica o Controller (AuthController)
    ]); // 4. Se a route for marcada como pública, permite o access (return true)

    if (isPublic) {
      return true;
    } // 5. Caso contrário, executa o AuthGuard padrão (que requer o JWT)

    return super.canActivate(context);
  }
}
