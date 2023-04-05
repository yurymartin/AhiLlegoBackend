import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Order } from '../schemas/order.schema';
import { Product } from '../../products/schemas/product.schema';

export class CreateOrderDetailDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  orderId: Order | string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  productId: Product | string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly comment: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {}
