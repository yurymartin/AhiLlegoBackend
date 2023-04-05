import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsUrl,
  IsDecimal,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Company } from '../../companies/schemas/company.schema';
import { TypeProduct } from '../schemas/typeProduct.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly image: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  discount?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status?: number;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  companyId: string | Company;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  typeProductId: string | TypeProduct;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
