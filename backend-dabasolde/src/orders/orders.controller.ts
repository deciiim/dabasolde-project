import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, UseGuards, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- PUBLIC ENDPOINTS ---

  @Post()
  @UseInterceptors(FileInterceptor('receipt', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `receipt-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(
    @Body() body: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const receiptPath = file ? file.filename : null;
    return this.ordersService.create(body, receiptPath);
  }

  @Get(':ref')
  findOne(@Param('ref') ref: string) {
    return this.ordersService.findOne(ref);
  }

  // --- ADMIN ENDPOINTS (Protected) ---

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    // FIX: Convert 'id' string to number using '+'
    return this.ordersService.updateStatus(+id, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    // FIX: Convert 'id' string to number using '+'
    return this.ordersService.remove(+id);
  }
}