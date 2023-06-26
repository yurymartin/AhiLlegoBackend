import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsEmail,
  IsUrl,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class schedule {
  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly commission: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly ruc: string;

  // @IsBase64()
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly logo?: string;

  // @IsBase64()
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly image?: string;

  // @IsBase64()
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly contract?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly openDays: [number];

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly schedule: schedule;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly businessLineDetailId?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly nameUser: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly surnameUser: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly documentTypeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly documentNumber: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
