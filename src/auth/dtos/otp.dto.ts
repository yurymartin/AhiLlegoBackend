import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOtpDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly code: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly expired: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tokenDevice: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateOtpDto extends PartialType(CreateOtpDto) {}
