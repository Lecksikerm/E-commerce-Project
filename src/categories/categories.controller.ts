import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [CategoryDto] })
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin-token')
  @Post('/')
  @ApiBody({ type: CategoryDto })
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  create(@Body() dto: CategoryDto) {
    return this.categoriesService.create(dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin-token')
  @Patch('/:id')
  @ApiBody({ type: CategoryDto })
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  update(@Param('id') id: string, @Body() dto: Partial<CategoryDto>) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth('admin-token')
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
