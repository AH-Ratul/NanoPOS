import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { SaleModule } from './modules/sale/sale.module.js';

@Module({
  imports: [PrismaModule, AuthModule, ProductModule, SaleModule],
})
export class AppModule { }
