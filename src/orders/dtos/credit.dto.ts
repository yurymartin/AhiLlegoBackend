import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { DiscountCode } from '../schemas/discountCode.schema';

export class CreateCreditDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  code?: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  userId: User | string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  discountCodeId: DiscountCode | string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateCreditDto extends PartialType(CreateCreditDto) {}
