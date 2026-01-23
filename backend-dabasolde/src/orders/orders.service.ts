import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- ADMIN: Get all orders (Newest first) ---
  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- ADMIN: Update order status (PENDING -> COMPLETED/REJECTED) ---
  async updateStatus(id: string, status: string) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  // --- PUBLIC: Create a new order ---
  async create(data: any, receiptFilename: string | null) {
    // Generate a short ID (e.g., DS-8392)
    const shortRef = `DS-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await this.prisma.order.create({
      data: {
        shortRef: shortRef,
        amount: Number(data.amount), // Ensure it's a number
        price: Number(data.price),
        phone: data.phone,
        fullName: data.fullName,
        paymentMethod: data.paymentMethod,
        bank: data.bank || null,
        receiptImage: receiptFilename, // Save the filename
        status: 'PENDING',
      },
    });

    return { 
      success: true, 
      orderId: order.shortRef,
      message: "Order created successfully" 
    };
  }

  // --- PUBLIC: Find one order by Tracking Ref (DS-XXXX) ---
  async findOne(ref: string) {
    const order = await this.prisma.order.findUnique({
      where: { shortRef: ref },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
  async remove(id: string) {
    try {
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}