import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('/')
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully.' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('user-token')
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.create(dto);
    }

    @Get('/')
    @ApiOperation({ summary: 'Get all orders (Admin)' })
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Get all orders of a specific user' })
    findByUser(@Param('userId') userId: string) {
        return this.ordersService.findByUser(userId);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single order' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch('/:id/status')
    @ApiOperation({ summary: 'Update order status' })
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, dto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete or cancel an order' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('user-token')
    remove(@Param('id') id: string) {
        return this.ordersService.remove(id);
    }
}
