import { IsString, IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNumber()
    price!: number;

    @IsNotEmpty()
    @IsNumber()
    stock!: number;


    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNotEmpty()
    @IsUUID()
    categoryId!: string; //  allow category ID in the request
}
