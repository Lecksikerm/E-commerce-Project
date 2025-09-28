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
import { Category } from '../dal/entities/category.entity';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { PageDto } from 'src/auth/dto/page.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async getAll(pageOptions: PageOptionsDto): Promise<PageDto<ProductDto>> {
    const { skip, take, searchTerm, sortBy, sortDir } = pageOptions;

    const query = this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .select([
        'p.id',
        'p.name',
        'p.price',
        'p.stock',
        'p.img',
        'p.description',
        'p.createdAt',
        'p.updatedAt',
        'category.id',
        'category.name',
        'category.description',
        'category.createdAt',
        'category.updatedAt',
      ]);

    if (searchTerm) {
      query.andWhere(
        'p.name ILIKE :searchTerm OR p.description ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    query.orderBy(`p.${sortBy}`, sortDir).skip(skip).take(take);

    const [products, total] = await Promise.all([query.getMany(), query.getCount()]);
    const data: ProductDto[] = products.map((product) => new ProductDto(product));
    return new PageDto<ProductDto>(data, total);
  }

  async create(dto: ProductDto, admin: Admin): Promise<ProductDto> {
    let category: Category = null;

    if (dto.categoryId) {
      category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({ ...dto, createdBy: admin, category });
    const saved = await this.productRepository.save(product);
    return new ProductDto(saved);
  }

  async update(id: string, dto: Partial<ProductDto>, admin: Admin): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdBy', 'category'],
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    if (product.createdBy && product.createdBy.id !== admin.id) {
      throw new UnauthorizedException('Not allowed to update this product');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    Object.assign(product, dto);
    const updated = await this.productRepository.save(product);
    return new ProductDto(updated);
  }

  async remove(id: string, admin: Admin): Promise<{ deleted: boolean }> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    if (product.createdBy && product.createdBy.id !== admin.id) {
      throw new UnauthorizedException('Not allowed to delete this product');
    }

    await this.productRepository.remove(product);
    return { deleted: true };
  }

  async getOne(id: string, admin: Admin): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return new ProductDto(product);
  }
}

