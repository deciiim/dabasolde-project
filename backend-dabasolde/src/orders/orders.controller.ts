import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, UseGuards, Patch ,Delete} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport'; // 1. Import AuthGuard

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

  @UseGuards(AuthGuard('jwt')) // 2. Protect this route (Login required)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt')) // 3. Protect this route (Login required)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
  @UseGuards(AuthGuard('jwt')) // Protect so only Admin can delete
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}