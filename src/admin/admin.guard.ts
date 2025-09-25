import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Admin } from '../dal/entities/admin.entity';

@Injectable()
export class AdminGuard extends AuthGuard('admin-jwt') {
  canActivate(context: ExecutionContext) {
    // Calls the Passport strategy to validate the token
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext, status?: any): TUser {

    if (err || !user) {
      throw err || new UnauthorizedException('Admin authentication failed');
    }
    return user; // This will be assigned to req.user in the controller
  }
}

