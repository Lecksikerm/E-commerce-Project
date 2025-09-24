import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

/** Admin Sign-up DTO */
export class CreateAdminDto {
  @ApiProperty({ example: 'admin2@gmail.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin Two', description: 'Full name of the admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: 'admin2', description: 'Username of the admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: '123456', description: 'Password 6-64 chars' })
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

/** Admin Login DTO */
export class LoginAdminDto {
  @ApiProperty({ example: 'admin2@gmail.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password 6-64 chars' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}


