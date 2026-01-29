import { Module } from '@nestjs/common';
import { SaleService } from './sale.service.js';
import { SaleController } from './sale.controller.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SaleController],
  providers: [SaleService, JwtService, ConfigService],
})
export class SaleModule {}
