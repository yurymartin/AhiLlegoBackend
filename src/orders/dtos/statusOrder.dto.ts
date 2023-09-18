import { IsString, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStatusOrderDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly header: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly color: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly icon: string;
}

export class UpdateStatusOrderDto extends PartialType(CreateStatusOrderDto) {}
