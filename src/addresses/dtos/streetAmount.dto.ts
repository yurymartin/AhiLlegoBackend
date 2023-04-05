import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Street } from '../schemas/street.schema';

export class CreateStreetAmountDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  streetOriginId: string | Street;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  streetDestinationId: string | Street;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly amount: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateStreetAmountDto extends PartialType(CreateStreetAmountDto) {}
