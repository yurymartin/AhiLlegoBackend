import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Street } from '../schemas/street.schema';
import { Company } from '../../companies/schemas/company.schema';

export class Coordinates {
  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}

export class CreateAddressCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly reference: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly coordinates?: Coordinates;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  companyId: string | Company;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  streetId: string | Street;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  status?: boolean;
}

export class UpdateAddressCompanyDto extends PartialType(
  CreateAddressCompanyDto,
) {}
