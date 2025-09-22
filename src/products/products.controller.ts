import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { Admin } from '../dal/entities/admin.entity';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) { }

  @Get('/')
  async findAll() {
    this.logger.log('Fetching all products...');
    try {
      const products = await this.productsService.findAll();
      this.logger.log(`Found ${products.length} products`);
      return products;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error fetching products', error.stack);
      } else {
        this.logger.error('Unknown error fetching products', JSON.stringify(error));
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    const admin: Admin = req.user; // JWT should contain admin info
    this.logger.log(`Creating product by admin ID: ${admin.id}`);
    try {
      const product = await this.productsService.create(dto, admin);
      this.logger.log(`Product created with ID: ${product.id}`);
      return product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error creating product', error.stack);
      } else {
        this.logger.error('Unknown error creating product', JSON.stringify(error));
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
    @Req() req: any,
  ) {
    const admin: Admin = req.user;
    this.logger.log(`Updating product ID: ${id} by admin ID: ${admin.id}`);
    try {
      const updated = await this.productsService.update(id, dto, admin);
      this.logger.log(`Product updated: ${JSON.stringify(updated)}`);
      return updated;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error updating product ID: ${id}`, error.stack);
      } else {
        this.logger.error(`Unknown error updating product ID: ${id}`, JSON.stringify(error));
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const admin: Admin = req.user;
    this.logger.log(`Deleting product ID: ${id} by admin ID: ${admin.id}`);
    try {
      const result = await this.productsService.remove(id, admin);
      this.logger.log(`Product deleted: ${JSON.stringify(result)}`);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting product ID: ${id}`, error.stack);
      } else {
        this.logger.error(`Unknown error deleting product ID: ${id}`, JSON.stringify(error));
      }
      throw error;
    }
  }
}


