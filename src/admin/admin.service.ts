import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<Admin> {
    // ✅ Prevent duplicate admin email
    const exists = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Admin with this email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ ...dto, password: hashed });
    return this.adminRepo.save(admin);
  }

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return admin;
  }

  async login(dto: LoginAdminDto) {
  const admin = await this.validateAdmin(dto.email, dto.password);
  const payload = { sub: admin.id, email: admin.email, role: 'admin' };
  const { password, ...adminWithoutPassword } = admin; // Remove password

  return {
    access_token: this.jwtService.sign(payload),
    admin: adminWithoutPassword, // Only safe fields
  };
}

 async findAll(): Promise<Partial<Admin>[]> {
  const admins = await this.adminRepo.find();
  return admins.map(({ password, ...adminWithoutPassword }) => adminWithoutPassword);
}

  async findOne(id: string): Promise<Partial<Admin>> {
  const admin = await this.adminRepo.findOne({ where: { id } });
  if (!admin) throw new NotFoundException('Admin not found');
  const { password, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
}
}

