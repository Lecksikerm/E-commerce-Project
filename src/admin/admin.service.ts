import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../dal/entities/admin.entity';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  /** Create a new admin with unique email & username */
  async createAdmin(dto: CreateAdminDto): Promise<Partial<Admin>> {
    // Check if email already exists
    const existingEmail = await this.adminRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Admin with this username already exists');
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create and save admin
    const admin = this.adminRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepo.save(admin);

    // Exclude password before returning
    const { password, ...adminWithoutPassword } = savedAdmin;
    return adminWithoutPassword;
  }

  /**Validate admin credentials for login */
  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'username', 'password'],
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return admin;
  }

  /**Login admin and return JWT token + safe fields */
  async login(dto: LoginAdminDto) {
    const admin = await this.validateAdmin(dto.email, dto.password);

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: 'admin',
    };

    const { password, ...adminWithoutPassword } = admin;

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ADMIN_SECRET || 'my-super-admin-secret-key', 
        expiresIn: '1d',
      }),
      admin: adminWithoutPassword,
    };
  }

  /** Fetch all admins without exposing passwords */
  async findAll(): Promise<Partial<Admin>[]> {
    const admins = await this.adminRepo.find();
    return admins.map(({ password, ...adminWithoutPassword }) => adminWithoutPassword);
  }

  /**  Fetch a single admin by ID without password */
  async findOne(id: string): Promise<Partial<Admin>> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }
}


