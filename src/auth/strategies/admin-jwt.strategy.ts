import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../dal/entities/admin.entity';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ADMIN_SECRET || 'my-super-admin-secret-key',
    });
  }

  async validate(payload: any): Promise<{ id: string; email: string; role: string }> {
    const admin = await this.adminRepo.findOne({ where: { id: payload.sub } });
    if (!admin) {
      throw new UnauthorizedException('Invalid admin token');
    }

    return {
      id: admin.id,
      email: admin.email,
      role: 'admin',
    };
  }
}
