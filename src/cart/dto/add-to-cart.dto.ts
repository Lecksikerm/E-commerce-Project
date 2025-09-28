import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: '4e1e6c7e-19ef-4143-9fb0-cbcf52e83226', type: 'string', format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to add', type: 'number', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
