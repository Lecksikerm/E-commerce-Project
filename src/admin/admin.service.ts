import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../dal/entities/admin.entity';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  /** Create a new admin and hide password in the response */
  async createAdmin(dto: CreateAdminDto): Promise<Partial<Admin>> {
    const exists = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Admin with this email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ ...dto, password: hashedPassword });
    const savedAdmin = await this.adminRepo.save(admin);

    // Remove password explicitly
    const { password, ...adminWithoutPassword } = savedAdmin;
    return adminWithoutPassword;
  }

  /** Validate admin credentials for login */
  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'username', 'password'], // include password for validation
    });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return admin;
  }

  /** Login admin and return JWT token along with safe fields */
  async login(dto: LoginAdminDto) {
    const admin = await this.validateAdmin(dto.email, dto.password);
    const payload = { sub: admin.id, email: admin.email, role: 'admin' };

    // Remove password before returning
    const { password, ...adminWithoutPassword } = admin;

    return {
      access_token: this.jwtService.sign(payload),
      admin: adminWithoutPassword,
    };
  }

  /** Return all admins without passwords */
  async findAll(): Promise<Partial<Admin>[]> {
    const admins = await this.adminRepo.find();
    return admins.map(({ password, ...adminWithoutPassword }) => adminWithoutPassword);
  }

  /** Return a single admin by ID without password */
  async findOne(id: string): Promise<Partial<Admin>> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }
}
