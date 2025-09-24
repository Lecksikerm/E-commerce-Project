import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../dal/entities/product.entity';
import { Repository } from 'typeorm';
import { SORT_ORDER } from 'src/core/dto/page-options.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository find method', async () => {
    repo.find = jest.fn().mockResolvedValue([]);
    const result = await service.findAll('', {
      sortBy: 'createdAt',
      sortDir: SORT_ORDER.DESC,
    } as any);
    expect(result).toEqual([]);
    expect(repo.find).toHaveBeenCalled();
  });
});

