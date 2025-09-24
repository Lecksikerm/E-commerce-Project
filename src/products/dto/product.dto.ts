import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'Smart-TV', description: 'Name of the product' })
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
}

