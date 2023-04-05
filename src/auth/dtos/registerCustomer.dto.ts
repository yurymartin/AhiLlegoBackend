import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDecimal,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateRegisterCustomerDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  documentTypeId: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  documentNumber: string | null;

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
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly password: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  profileId: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  credit: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tokenDevice: string;
}

export class UpdateRegisterCustomerDto extends PartialType(
  CreateRegisterCustomerDto,
) {}
