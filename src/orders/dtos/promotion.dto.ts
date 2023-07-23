import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string = null;

  @IsNumber()
  @Min(1)
  @Max(2)
  @IsNotEmpty()
  @ApiProperty()
  typeId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  value: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
