import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { AdminGuard } from './admin.guard';

@ApiTags('Admin')
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // ✅ Public endpoint (no guard)
  @Post('/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async register(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @ApiBearerAuth('admin-token')
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Returns list of all admins' })
  async getAllAdmins() {
    return this.adminService.findAll();
  }

  @ApiBearerAuth('admin-token')
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Returns admin details' })
  async getAdmin(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
}
