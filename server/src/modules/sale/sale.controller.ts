import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('sales')
@UseGuards(AuthGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    const sale = await this.saleService.create(createSaleDto);
    return {
      message: 'Sale created successfully',
      data: sale,
    };
  }

  @Get()
  async findAll() {
    const sales = await this.saleService.findAll();
    return {
      message: 'Sales retrieved successfully',
      data: sales,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = await this.saleService.findOne(id);
    return {
      message: 'Sale retrieved successfully',
      data: sale,
    };
  }
}
