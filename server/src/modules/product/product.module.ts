import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [ProductController],
    providers: [ProductService, JwtService, ConfigService],
})
export class ProductModule { }
