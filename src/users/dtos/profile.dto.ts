import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
