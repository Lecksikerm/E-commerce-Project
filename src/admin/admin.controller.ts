import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** Register a new admin */
  @Post('/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async register(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  /** Admin login */
  @Post('/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  /** Get all admins (protected) */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Returns list of all admins' })
  async getAllAdmins() {
    return this.adminService.findAll();
  }

  /** Get a single admin by ID (protected) */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Returns admin details' })
  async getAdmin(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
}


