import { IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDistanceAmountDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly minDistance: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly maxDistance: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly amount: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean = true;
}

export class UpdateDistanceAmountDto extends PartialType(
  CreateDistanceAmountDto,
) {}
