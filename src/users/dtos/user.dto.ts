import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DocumentType } from '../schemas/documentType.shema';
import { Profile } from '../schemas/profile.schema';

export class CreateUserDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  documentTypeId?: string | DocumentType | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  documentNumber?: string | null;

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
  @IsOptional()
  @ApiProperty()
  readonly password?: string | null;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  profileId?: string | Profile;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  credit: number | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
