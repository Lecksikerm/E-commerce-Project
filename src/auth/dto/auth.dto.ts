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
  IsEnum,
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
  @ApiProperty({ example: 'ademola@gmail.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Ademola', description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;
}

export class LoginDto extends PasswordDto {
  @ApiProperty({ example: 'ademola', description: 'Username or email' })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;
}

export class AdminSignUpDto {
  @ApiProperty({ example: 'admin3@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin3' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: '1234560' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Smart-TV' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '64 inches HD display' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'External SSD' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiPropertyOptional({ example: '500GB USB-C SSD' })
  @IsOptional()
  @IsString()
  description?: string;
}

export enum CartStatus {
  ACTIVE = 'active',
  CHECKED_OUT = 'checked_out',
}

export class CartItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: '4e1e6c7e-19ef-4143-9fb0-cbcf52e83226' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CartDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: CartStatus, example: CartStatus.ACTIVE })
  @IsEnum(CartStatus)
  status: CartStatus;

  @ApiProperty({ type: () => [CartItemDto] })
  items: CartItemDto[];
}




