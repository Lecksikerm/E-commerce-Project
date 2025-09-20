import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    this.logger.log('Fetching all products from DB...');
    try {
      const products = await this.productRepository.find({ relations: ['createdBy'] });
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

  async create(dto: CreateProductDto, admin: Admin): Promise<Product> {
    this.logger.log(`Creating product with DTO: ${JSON.stringify(dto)} by admin ID: ${admin.id}`);
    try {
      const product = this.productRepository.create({ ...dto, createdBy: admin });
      const savedProduct = await this.productRepository.save(product);
      this.logger.log(`Product created with ID: ${savedProduct.id}`);
      return savedProduct;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error creating product', error.stack);
      } else {
        this.logger.error('Unknown error creating product', JSON.stringify(error));
      }
      throw error;
    }
  }

  async update(id: string, dto: Partial<CreateProductDto>, admin: Admin): Promise<Product> {
    this.logger.log(`Updating product ID: ${id} by admin ID: ${admin.id}`);
    try {
      const product = await this.productRepository.findOne({ where: { id }, relations: ['createdBy'] });
      if (!product) {
        this.logger.warn(`Product ID: ${id} not found`);
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      if (product.createdBy?.id !== admin.id) {
        this.logger.warn(`Admin ${admin.id} unauthorized to update product ID: ${id}`);
        throw new UnauthorizedException();
      }

      Object.assign(product, dto);
      const updated = await this.productRepository.save(product);
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

  async remove(id: string, admin: Admin): Promise<{ deleted: boolean }> {
    this.logger.log(`Deleting product ID: ${id} by admin ID: ${admin.id}`);
    try {
      const product = await this.productRepository.findOne({ where: { id }, relations: ['createdBy'] });
      if (!product) {
        this.logger.warn(`Product ID: ${id} not found`);
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      if (product.createdBy?.id !== admin.id) {
        this.logger.warn(`Admin ${admin.id} unauthorized to delete product ID: ${id}`);
        throw new UnauthorizedException();
      }

      await this.productRepository.remove(product);
      this.logger.log(`Product ID: ${id} deleted successfully`);
      return { deleted: true };
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




