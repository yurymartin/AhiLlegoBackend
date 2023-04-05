import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BusinessLine } from '../schemas/businessLine.schema';

export class CreateBusinessLineDetailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly image?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status?: boolean;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  businessLineId: string | BusinessLine;
}

export class UpdateBusinessLineDetailDto extends PartialType(
  CreateBusinessLineDetailDto,
) {}
