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
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { PageDto } from 'src/auth/dto/page.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async getAll(
    userId: string,
    pageOption: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const { skip, take, searchTerm, sortBy, sortDir } = pageOption;

    const query = this.productRepository
      .createQueryBuilder('p')
       .select(['p'])
      

    if (searchTerm) {
      query.andWhere(
        'p.name ILIKE :searchTerm OR p.description ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    query.orderBy(`p.${sortBy}`, sortDir).skip(skip).take(take);

    const [products, total] = await Promise.all([
      query.getMany(),
      query.getCount(),
    ]);

    const data: ProductDto[] = products.map((product) => new ProductDto(product));

    return new PageDto<ProductDto>(data, total);
  }

  async create(dto: ProductDto, admin: Admin): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      createdBy: admin,
    });
    return this.productRepository.save(product);
  }

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


