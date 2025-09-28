import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Category } from 'src/dal/entities/category.entity';

export class CategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'All electronic products', description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  constructor(category?: Category) {
    if (category) {
      this.name = category.name;
      this.description = category.description;
    }
  }
}
