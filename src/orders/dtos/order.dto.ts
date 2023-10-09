import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  ArrayNotEmpty,
  IsInstance,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Company } from '../../companies/schemas/company.schema';
import { TypePay } from '../schemas/typePay.schema';
import { User } from '../../users/schemas/user.schema';
import { Address } from '../../addresses/schemas/address.schema';
import { DiscountCode } from '../schemas/discountCode.schema';

class DetailItem {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  comment: string;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  companyId: Company | string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  typePayId: TypePay | string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  userId: User | string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  addressId: Address | string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  discountCodeId: DiscountCode | string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DetailItem)
  readonly details: DetailItem[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
