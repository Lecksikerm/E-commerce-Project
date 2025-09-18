import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';
// Update the import path below if the actual path or filename is different
import { AdminGuard } from './admin.guard';
// Update the import path below to the correct location of jwt-auth.guard.ts
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('/register')
    async register(@Body() dto: CreateAdminDto) {
        return this.adminService.createAdmin(dto);
    }

    @Post('/login')
    async login(@Body() dto: LoginAdminDto) {
        return this.adminService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getAllAdmins() {
        return this.adminService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getAdmin(@Param('id') id: string) {
        return this.adminService.findOne(id);
    }
}
