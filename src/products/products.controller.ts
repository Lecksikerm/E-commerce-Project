import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductDto } from './dto/product.dto';
import { Admin } from '../dal/entities/admin.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Product } from '../dal/entities/product.entity';
import { UpdateProductDto } from 'src/auth/dto/auth.dto';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Get all products */
  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products', type: [Product] })
  async findAll() {
    return this.productsService.getAll();
  }

  /** Create a new product (Admin only) */
  @UseGuards(AdminJwtAuthGuard)
  @Post('/')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Create a product (Admin only)' })
  @ApiBody({ type: ProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  async create(@Body() dto: ProductDto, @Req() req: any) {
    const admin: Admin = req.user; // injected by JwtStrategy
    return this.productsService.create(dto, admin);
  }

  /** Update a product (Admin only) */
  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiBody({ type: UpdateProductDto, description: 'Partial update allowed' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    if (!req.user) {
      throw new NotFoundException('Admin user not found in request');
    }

    const admin: Admin = req.user;
    return this.productsService.update(id, dto, admin);
  }

  /** Delete a product (Admin only) */
  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: any) {
    if (!req.user) {
      throw new NotFoundException('Admin user not found in request');
    }

    const admin: Admin = req.user;
    return this.productsService.remove(id, admin);
  }
}



