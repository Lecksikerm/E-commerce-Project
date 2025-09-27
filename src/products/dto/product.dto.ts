import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';
import { Category, Product } from 'src/dal/entities';

export class ProductDto {
  @ApiProperty({ example: 'Power Bank', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 20, description: 'Quantity in stock' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.png', description: 'Optional image URL', required: false })
  @IsString()
  @IsOptional()
  img?: string;

  @ApiProperty({ example: '64 inches HD display', description: 'Optional product description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  
  @ApiProperty({ example: 'uuid-of-category', description: 'Optional category ID', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;

  constructor(product?: Product) {
    if (product) {
      this.name = product.name;
      this.price = product.price;
      this.stock = product.stock;
      this.img = product.img;
      this.description = product.description;
      this.categoryId = product.category?.id;
       this.category = product.category; 
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    }
  }
}

