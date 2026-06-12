import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }

    const token = authHeader.slice(7);

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role || 'user',
      };
    } catch {
      // Token invalid or expired — ignore, user stays undefined
    }

    return true;
  }
}
