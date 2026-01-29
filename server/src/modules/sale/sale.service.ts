import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SaleService {
    constructor(private prisma: PrismaService) { }
 
    async create(createSaleDto: CreateSaleDto) {
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const saleItemsData: { productId: string; quantity: number; price: number }[] = [];

            for (const item of createSaleDto.items) {

                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.productId} not found`);
                }

                if (product.stock_quantity < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product ${product.name}`);
                }

                // Update stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock_quantity: {
                            decrement: item.quantity,
                        },
                    },
                });

                totalAmount += product.price * item.quantity;
                saleItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                });
            }

            // Create Sale and SaleItems
            const sale = await tx.sale.create({
                data: {
                    totalAmount,
                    saleItems: {
                        create: saleItemsData,
                    },
                },
                include: {
                    saleItems: true,
                },
            });

            return sale;
        });
    }

    async findAll() {
        return this.prisma.sale.findMany({
            include: {
                saleItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                saleItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!sale) {
            throw new NotFoundException('Sale not found');
        }

        return sale;
    }
}
