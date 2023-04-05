import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(20)
  @MinLength(5)
  readonly code: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly value: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly representative: string;

  @IsDateString({ strict: true } as any)
  @IsNotEmpty()
  @ApiProperty()
  readonly expirationDate: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateDiscountCodeDto extends PartialType(CreateDiscountCodeDto) {}
