import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Extend Express Request interface to include 'admin'
declare module 'express-serve-static-core' {
  interface Request {
    admin?: any;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token missing');

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'admin') throw new UnauthorizedException('Admin only');
      req['admin'] = payload; 
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
