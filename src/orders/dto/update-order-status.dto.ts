import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export class UpdateOrderStatusDto {
    @ApiProperty({
        description: 'Order status',
        enum: OrderStatus,
        example: 'paid',
    })
    @IsEnum(OrderStatus, {
        message:
            'Status must be one of: pending, paid, shipped, delivered, cancelled',
    })
    @IsNotEmpty({ message: 'Status is required' })
    status: OrderStatus;
}
