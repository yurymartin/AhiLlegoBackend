import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Profile } from '../../users/schemas/profile.schema';
import { DocumentType } from '../../users/schemas/documentType.shema';

export class CreateDeliveryManDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  documentTypeId: string | DocumentType | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly documentNumber: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly surname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  profileId: string | Profile | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  credit: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tokenDevice: string;
}

export class UpdateDeliveryManDto extends PartialType(CreateDeliveryManDto) {}
