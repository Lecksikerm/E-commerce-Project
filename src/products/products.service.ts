import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../dal/entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { Admin } from '../dal/entities/admin.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /** Get all products (with optional search & sorting) */
  async getAll(
    searchTerm?: string,
    sortBy: string = 'createdAt',
    sortDir: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.createdBy', 'admin')
      .leftJoinAndSelect('p.category', 'category');

    if (searchTerm) {
      query.where(
        'p.name ILIKE :searchTerm OR p.description ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    query.orderBy(`p.${sortBy}`, sortDir);

    return query.getMany();
  }

  /** Create a new product */
  async create(dto: ProductDto, admin: Admin): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      createdBy: admin,
    });
    return this.productRepository.save(product);
  }

  /** Update a product (admin check simplified) */
  async update(
    id: string,
    dto: Partial<ProductDto>,
    admin: Admin,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    
    if (product.createdBy && product.createdBy.id !== admin.id) {
      throw new UnauthorizedException('Not allowed to update this product');
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string, admin: Admin): Promise<{ deleted: boolean }> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.createdBy && product.createdBy.id !== admin.id) {
      throw new UnauthorizedException('Not allowed to delete this product');
    }

    await this.productRepository.remove(product);
    return { deleted: true };
  }
}














