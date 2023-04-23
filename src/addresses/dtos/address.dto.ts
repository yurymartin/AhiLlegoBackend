import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TypeAddress } from '../schemas/typeAddress.schema';
import { User } from '../../users/schemas/user.schema';
import { Street } from '../schemas/street.schema';

export class Coordinates {
  @IsOptional()
  accuracy?: number;

  @IsOptional()
  altitude?: number;

  @IsOptional()
  heading?: number;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  speed?: number;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly address: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly reference: string = null;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly coordinates?: Coordinates;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  typeAddressId: string | TypeAddress;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  userId: string | User;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  streetId: string | Street;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  status?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
