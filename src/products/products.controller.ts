import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { Admin } from 'src/dal/entities/admin.entity';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { UpdateProductDto } from 'src/auth/dto/auth.dto';
import { ProductDto } from './dto/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(AdminJwtAuthGuard)
  @Get('/')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductDto], 
  })
  async findAll(
    @Req() req: { user: Admin },
    @Query() pageOptions: PageOptionsDto,
  ) {
    return this.productsService.getAll( pageOptions);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: ProductDto,
  })
  async findOne(@Param('id') id: string, @Req() req: { user: Admin }) {
    return this.productsService.getOne(id, req.user);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post('/')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Create a product (Admin only)' })
  @ApiBody({ type: ProductDto })
  async create(@Body() dto: ProductDto, @Req() req: { user: Admin }) {
    return this.productsService.create(dto, req.user);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: { user: Admin },
  ) {
    return this.productsService.update(id, dto, req.user);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('admin-token')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  async remove(@Param('id') id: string, @Req() req: { user: Admin }) {
    return this.productsService.remove(id, req.user);
  }
}

