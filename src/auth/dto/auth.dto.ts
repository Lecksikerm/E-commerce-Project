import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string; 

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  name!: string; 

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  password!: string; 
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string; 

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string; 
}



