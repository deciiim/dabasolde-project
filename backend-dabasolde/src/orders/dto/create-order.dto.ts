import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  bank?: string;

  @IsString()
  @IsNotEmpty()
  productType: string;
}
