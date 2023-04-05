import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './user.dto';
import { Type } from 'class-transformer';

export class CreateUserSesionDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly token: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tokenDevice: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  @ApiProperty()
  readonly user: any;
}

export class UpdateUserSesionDto extends PartialType(CreateUserSesionDto) {}
