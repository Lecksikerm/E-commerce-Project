import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class PasswordDto {
  @ApiProperty({
    example: 'password123',
    description: 'Password must be 6-64 characters long',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  password: string;
}


export class SignUpDto extends PasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the account',
    example: 'ademola@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the user',
    example: 'Ademola',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  name: string;
}

export class LoginDto extends PasswordDto {
  @ApiProperty({
    example: 'ademola',
    description: 'Username or email of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username or Email is required' })
  usernameOrEmail: string;


  @ApiProperty({
    example: 'password123',
    description: 'Password must be 6-64 characters long',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  password: string;

}


export class AdminSignUpDto {
  @ApiProperty({ example: 'admin3@gmail.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin3', description: 'Full name of the admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: '1234560', description: 'Password 6-64 chars' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
export class CreateProductDto {
  @ApiProperty({ example: 'Smart-TV', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '64 inches HD display', description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5000, description: 'Product price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 20, description: 'Quantity in stock' })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'External SSD', description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 300, description: 'Product price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 5, description: 'Quantity in stock' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.png', description: 'Product image URL' })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiPropertyOptional({ example: '500GB USB-C SSD', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;
}



