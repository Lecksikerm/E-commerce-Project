import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Updated quantity (0 to remove item)', type: 'number', minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}
